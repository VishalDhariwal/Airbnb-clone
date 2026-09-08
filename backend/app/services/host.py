from datetime import date
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload
from app.models import (
    Amenity,
    BlockedDate,
    Booking,
    Category,
    Listing,
    ListingPhoto,
    User,
)
from app.schemas.host import (
    HostBlockedDatesRequest,
    HostDeleteResponse,
    HostGuestSummary,
    HostListingCreateRequest,
    HostListingOut,
    HostListingUpdateRequest,
    HostReservationOut,
)


def _load_requested_rows(db: Session, model, ids: List[int], label: str):
    """Load association rows and reject stale/unknown IDs instead of silently dropping them."""
    unique_ids = list(dict.fromkeys(ids))
    if not unique_ids:
        return []
    rows = db.query(model).filter(model.id.in_(unique_ids)).all()
    found_ids = {row.id for row in rows}
    missing_ids = [row_id for row_id in unique_ids if row_id not in found_ids]
    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unknown {label} IDs: {missing_ids}",
        )
    return rows


def _format_host_listing(lst: Listing) -> HostListingOut:
    cover = lst.photos[0].url if lst.photos else None
    confirmed_bks = [b for b in (lst.bookings or []) if b.status == "confirmed"]
    out = HostListingOut.model_validate(lst)
    out.cover_photo = cover
    out.total_reservations = len(lst.bookings or [])
    out.total_earnings = sum(b.total_price for b in confirmed_bks)
    return out


def get_host_listings(db: Session, host_id: int) -> List[HostListingOut]:
    """Returns all listings owned by host with basic metrics."""
    listings = (
        db.query(Listing)
        .options(
            selectinload(Listing.photos),
            selectinload(Listing.bookings),
        )
        .filter(Listing.host_id == host_id)
        .order_by(Listing.created_at.desc())
        .all()
    )
    return [_format_host_listing(lst) for lst in listings]


def create_host_listing(
    db: Session, host: User, payload: HostListingCreateRequest
) -> HostListingOut:
    """Creates a new listing for the host with photos and associations."""
    listing = Listing(
        host_id=host.id,
        title=payload.title,
        description=payload.description,
        property_type=payload.property_type,
        room_type=payload.room_type,
        address=payload.address,
        city=payload.city,
        state=payload.state,
        country=payload.country,
        latitude=payload.latitude,
        longitude=payload.longitude,
        price_per_night=payload.price_per_night,
        cleaning_fee=payload.cleaning_fee,
        max_guests=payload.max_guests,
        bedrooms=payload.bedrooms,
        beds=payload.beds,
        bathrooms=payload.bathrooms,
        is_active=True,
    )

    if payload.amenity_ids:
        listing.amenities = _load_requested_rows(
            db, Amenity, payload.amenity_ids, "amenity"
        )

    if payload.category_ids:
        listing.categories = _load_requested_rows(
            db, Category, payload.category_ids, "category"
        )

    for idx, url in enumerate(payload.photo_urls):
        listing.photos.append(ListingPhoto(url=url, position=idx))

    db.add(listing)
    db.commit()
    db.refresh(listing)

    # Reload with relationships
    reloaded = (
        db.query(Listing)
        .options(selectinload(Listing.photos), selectinload(Listing.bookings))
        .filter(Listing.id == listing.id)
        .first()
    )
    return _format_host_listing(reloaded or listing)


def update_host_listing(
    db: Session, host: User, listing_id: int, payload: HostListingUpdateRequest
) -> HostListingOut:
    """Updates listing details ensuring host ownership (§1.3)."""
    listing = (
        db.query(Listing)
        .options(selectinload(Listing.photos), selectinload(Listing.bookings))
        .filter(Listing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.host_id != host.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this listing.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    scalar_fields = [
        "title", "description", "property_type", "room_type", "address", "city",
        "state", "country", "latitude", "longitude", "price_per_night",
        "cleaning_fee", "max_guests", "bedrooms", "beds", "bathrooms", "is_active",
    ]
    for field in scalar_fields:
        if field in update_data:
            setattr(listing, field, update_data[field])

    if payload.amenity_ids is not None:
        listing.amenities = _load_requested_rows(
            db, Amenity, payload.amenity_ids, "amenity"
        )

    if payload.category_ids is not None:
        listing.categories = _load_requested_rows(
            db, Category, payload.category_ids, "category"
        )

    if payload.photo_urls is not None:
        listing.photos.clear()
        for idx, url in enumerate(payload.photo_urls):
            listing.photos.append(ListingPhoto(url=url, position=idx))

    db.commit()
    db.refresh(listing)
    return _format_host_listing(listing)


def delete_host_listing(db: Session, host: User, listing_id: int) -> HostDeleteResponse:
    """Soft deletes if bookings exist, hard deletes otherwise (§1.3)."""
    listing = (
        db.query(Listing)
        .options(selectinload(Listing.bookings))
        .filter(Listing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.host_id != host.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this listing.",
        )

    has_bookings = len(listing.bookings) > 0
    if has_bookings:
        listing.is_active = False
        db.commit()
        return HostDeleteResponse(
            id=listing_id,
            deleted=True,
            soft_deleted=True,
            message="Listing deactivated (soft-deleted) to preserve existing booking records.",
        )

    db.delete(listing)
    db.commit()
    return HostDeleteResponse(
        id=listing_id,
        deleted=True,
        soft_deleted=False,
        message="Listing permanently deleted.",
    )


def get_host_reservations(db: Session, host_id: int) -> List[HostReservationOut]:
    """Returns all reservations across host's listings sorted by check_in."""
    bookings = (
        db.query(Booking)
        .join(Listing, Booking.listing_id == Listing.id)
        .options(selectinload(Booking.guest), selectinload(Booking.listing))
        .filter(Listing.host_id == host_id)
        .order_by(Booking.check_in.desc())
        .all()
    )

    return [
        HostReservationOut(
            id=b.id,
            confirmation_code=b.confirmation_code,
            listing_id=b.listing_id,
            listing_title=b.listing.title,
            listing_city=b.listing.city,
            guest=HostGuestSummary.model_validate(b.guest),
            check_in=b.check_in,
            check_out=b.check_out,
            adults=b.adults,
            children=b.children,
            nights=b.nights,
            total_price=b.total_price,
            status=b.status,
            created_at=b.created_at,
        )
        for b in bookings
    ]


def manage_host_blocked_dates(
    db: Session, host: User, listing_id: int, payload: HostBlockedDatesRequest
) -> List[date]:
    """Sets/replaces unavailable dates for a listing."""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.host_id != host.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to block dates on this listing.",
        )

    db.query(BlockedDate).filter(BlockedDate.listing_id == listing_id).delete()
    distinct_dates = sorted(set(payload.dates))
    for d in distinct_dates:
        db.add(BlockedDate(listing_id=listing_id, date=d))

    db.commit()
    return distinct_dates


def get_host_blocked_dates(db: Session, host: User, listing_id: int) -> List[date]:
    """Return only dates explicitly blocked by this host for an owned listing."""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    if listing.host_id != host.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view blocked dates for this listing.",
        )
    return [
        row.date
        for row in (
            db.query(BlockedDate)
            .filter(BlockedDate.listing_id == listing_id)
            .order_by(BlockedDate.date.asc())
            .all()
        )
    ]
