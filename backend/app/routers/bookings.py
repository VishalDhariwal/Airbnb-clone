from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.database import get_db
from app.models import User
from app.schemas.booking import (
    BookingCancelResponse,
    BookingConfirmationOut,
    BookingCreateRequest,
    TripsResponse,
)
from app.services.booking import (
    cancel_booking,
    create_booking,
    get_booking_details,
    get_user_trips,
)

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post(
    "",
    response_model=BookingConfirmationOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new reservation",
)
def create_reservation(
    payload: BookingCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BookingConfirmationOut:
    """
    Creates a booking inside an atomic transaction (§1.3, §1.5).
    Re-validates date availability, snapshots price components,
    and returns a confirmation code.
    """
    return create_booking(db, current_user, payload)


@router.get(
    "/me",
    response_model=TripsResponse,
    summary="Get user trips partitioned into upcoming and past",
)
def get_my_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TripsResponse:
    """Returns guest reservations split into upcoming and past stays."""
    return get_user_trips(db, current_user.id)


@router.get(
    "/{booking_id}",
    response_model=BookingConfirmationOut,
    summary="Get booking confirmation details",
)
def get_booking_by_id(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BookingConfirmationOut:
    """
    Returns booking confirmation details.
    Accessible only by the guest who booked or the host of the listing.
    """
    return get_booking_details(db, current_user, booking_id)


@router.post(
    "/{booking_id}/cancel",
    response_model=BookingCancelResponse,
    summary="Cancel a booking",
)
def cancel_reservation(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BookingCancelResponse:
    """
    Cancels a confirmed reservation, immediately releasing the dates.
    Authorized for the guest or the listing's host.
    """
    booking = cancel_booking(db, current_user, booking_id)
    return BookingCancelResponse(
        id=booking.id,
        status=booking.status,
        confirmation_code=booking.confirmation_code,
        message="Reservation successfully cancelled.",
    )
