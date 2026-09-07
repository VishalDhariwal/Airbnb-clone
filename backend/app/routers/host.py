from datetime import date
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_host
from app.database import get_db
from app.models import User
from app.schemas.host import (
    HostBlockedDatesRequest,
    HostDeleteResponse,
    HostListingCreateRequest,
    HostListingOut,
    HostListingUpdateRequest,
    HostReservationOut,
)
from app.services.host import (
    create_host_listing,
    delete_host_listing,
    get_host_listings,
    get_host_reservations,
    manage_host_blocked_dates,
    update_host_listing,
)

router = APIRouter(prefix="/host", tags=["Host"])


@router.get(
    "/listings",
    response_model=List[HostListingOut],
    summary="List all properties owned by current host",
)
def list_my_listings(
    db: Session = Depends(get_db),
    current_host: User = Depends(get_current_host),
) -> List[HostListingOut]:
    """Returns all listings owned by the logged-in host with metrics."""
    return get_host_listings(db, current_host.id)


@router.post(
    "/listings",
    response_model=HostListingOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new property listing",
)
def create_new_listing(
    payload: HostListingCreateRequest,
    db: Session = Depends(get_db),
    current_host: User = Depends(get_current_host),
) -> HostListingOut:
    """Creates a new listing with photos, amenities, and categories."""
    return create_host_listing(db, current_host, payload)


@router.patch(
    "/listings/{listing_id}",
    response_model=HostListingOut,
    summary="Update listing details",
)
def update_listing(
    listing_id: int,
    payload: HostListingUpdateRequest,
    db: Session = Depends(get_db),
    current_host: User = Depends(get_current_host),
) -> HostListingOut:
    """Updates listing details. Guaranteed 403 if not owned by host."""
    return update_host_listing(db, current_host, listing_id, payload)


@router.delete(
    "/listings/{listing_id}",
    response_model=HostDeleteResponse,
    summary="Delete or soft-delete a listing",
)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_host: User = Depends(get_current_host),
) -> HostDeleteResponse:
    """
    Deletes listing: soft delete (is_active=false) if bookings exist,
    hard delete if no bookings exist (§1.3).
    """
    return delete_host_listing(db, current_host, listing_id)


@router.get(
    "/reservations",
    response_model=List[HostReservationOut],
    summary="Get all reservations across host's listings",
)
def list_host_reservations(
    db: Session = Depends(get_db),
    current_host: User = Depends(get_current_host),
) -> List[HostReservationOut]:
    """Returns all reservations across the host's listings sorted by check_in."""
    return get_host_reservations(db, current_host.id)


@router.put(
    "/listings/{listing_id}/blocked-dates",
    response_model=List[date],
    summary="Set blocked unavailable dates for listing",
)
def set_blocked_dates(
    listing_id: int,
    payload: HostBlockedDatesRequest,
    db: Session = Depends(get_db),
    current_host: User = Depends(get_current_host),
) -> List[date]:
    """Sets host-blocked calendar dates for this property."""
    return manage_host_blocked_dates(db, current_host, listing_id, payload)
