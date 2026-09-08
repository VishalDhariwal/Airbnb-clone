import secrets
from datetime import date
from typing import Dict, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload
from app.models import BlockedDate, Booking, Listing, User
from app.schemas.booking import (
    BookingConfirmationOut,
    BookingCreateRequest,
    ListingSummaryForBooking,
    TripsResponse,
)
from app.services.pricing import calculate_price_breakdown

CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"


def _generate_confirmation_code() -> str:
    """Generates a clean 8-char code (e.g. HM8X4P2R)."""
    random_part = "".join(secrets.choice(CODE_ALPHABET) for _ in range(6))
    return f"HM{random_part}"


def create_booking(
    db: Session,
    guest: User,
    payload: BookingCreateRequest,
) -> Booking:
    """
    Creates a booking inside an atomic transaction (§1.3 & §1.5).
    Re-checks availability, snapshots price components, and generates confirmation code.
    """
    # 1. Date sanity checks
    if payload.check_out <= payload.check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out date must be strictly after check-in date.",
        )
    if payload.check_in < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-in date cannot be in the past.",
        )

    # 2. Fetch listing
    listing = (
        db.query(Listing)
        .filter(Listing.id == payload.listing_id, Listing.is_active.is_(True))
        .first()
    )
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or inactive.",
        )

    # 3. Guest capacity check (adults + children)
    total_guests = payload.adults + payload.children
    if total_guests > listing.max_guests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Total guests ({total_guests}) exceeds maximum capacity of {listing.max_guests}.",
        )

    # 4. Atomic availability re-check for confirmed overlaps (§1.5)
    overlapping_booking = (
        db.query(Booking.id)
        .filter(
            Booking.listing_id == listing.id,
            Booking.status == "confirmed",
            Booking.check_in < payload.check_out,
            Booking.check_out > payload.check_in,
        )
        .first()
    )
    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="These dates are no longer available. Please choose another date range.",
            headers={"X-Error-Code": "DATES_UNAVAILABLE"},
        )

    # Check host-blocked dates
    blocked_day = (
        db.query(BlockedDate.id)
        .filter(
            BlockedDate.listing_id == listing.id,
            BlockedDate.date >= payload.check_in,
            BlockedDate.date < payload.check_out,
        )
        .first()
    )
    if blocked_day:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Host has blocked one or more of these dates.",
            headers={"X-Error-Code": "DATES_UNAVAILABLE"},
        )

    # 5. Price Snapshotting (server-computed, immutable)
    pricing = calculate_price_breakdown(
        nightly_rate=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee,
        check_in=payload.check_in,
        check_out=payload.check_out,
    )

    # 6. Generate unique confirmation code
    code = _generate_confirmation_code()
    while db.query(Booking.id).filter(Booking.confirmation_code == code).first():
        code = _generate_confirmation_code()

    # 7. Persist booking
    booking = Booking(
        confirmation_code=code,
        listing_id=listing.id,
        guest_id=guest.id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        adults=payload.adults,
        children=payload.children,
        infants=payload.infants,
        pets=payload.pets,
        nights=pricing["nights"],
        nightly_rate=pricing["nightly_rate"],
        cleaning_fee=pricing["cleaning_fee"],
        service_fee=pricing["service_fee"],
        taxes=pricing["taxes"],
        total_price=pricing["total_price"],
        status="confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Return eagerly loaded confirmation
    reloaded = (
        db.query(Booking)
        .options(selectinload(Booking.listing).selectinload(Listing.photos))
        .filter(Booking.id == booking.id)
        .first()
    )
    return format_booking_confirmation(reloaded or booking)


def cancel_booking(db: Session, user: User, booking_id: int) -> Booking:
    """Cancels a confirmed reservation, releasing the dates immediately."""
    booking = (
        db.query(Booking)
        .options(selectinload(Booking.listing))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    owns_listing = booking.listing is not None and booking.listing.host_id == user.id
    if booking.guest_id != user.id and not owns_listing:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to cancel this reservation.",
        )

    if booking.status == "cancelled":
        return booking

    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking


def format_booking_confirmation(b: Booking) -> BookingConfirmationOut:
    """Formats a Booking model into a BookingConfirmationOut schema."""
    lst = b.listing
    cover = lst.photos[0].url if (lst and lst.photos) else None
    summary = None
    if lst:
        summary = ListingSummaryForBooking(
            id=lst.id,
            title=lst.title,
            property_type=lst.property_type,
            room_type=lst.room_type,
            city=lst.city,
            state=lst.state,
            country=lst.country,
            cover_photo=cover,
            avg_rating=lst.avg_rating,
            review_count=lst.review_count,
        )
    out = BookingConfirmationOut.model_validate(b)
    out.listing = summary
    return out


def get_booking_details(
    db: Session,
    user: User,
    booking_id: int,
) -> BookingConfirmationOut:
    """Fetches single booking confirmation, verifying guest or listing host ownership."""
    booking = (
        db.query(Booking)
        .options(selectinload(Booking.listing).selectinload(Listing.photos))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found.",
        )

    is_guest = booking.guest_id == user.id
    is_host = booking.listing and booking.listing.host_id == user.id
    if not is_guest and not is_host:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this booking.",
        )

    return format_booking_confirmation(booking)


def get_user_trips(db: Session, guest_id: int) -> TripsResponse:
    """Returns user bookings partitioned into upcoming and past trips."""
    today = date.today()
    bookings = (
        db.query(Booking)
        .options(
            selectinload(Booking.listing).selectinload(Listing.photos),
        )
        .filter(Booking.guest_id == guest_id)
        .order_by(Booking.check_in.desc())
        .all()
    )

    upcoming: List[BookingConfirmationOut] = []
    past: List[BookingConfirmationOut] = []

    for b in bookings:
        item = format_booking_confirmation(b)
        if b.check_out >= today and b.status != "cancelled":
            upcoming.append(item)
        else:
            past.append(item)

    return TripsResponse(upcoming=upcoming, past=past)
