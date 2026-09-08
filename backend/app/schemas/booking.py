from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class BookingCreateRequest(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    adults: int = Field(default=1, ge=1)
    children: int = Field(default=0, ge=0)
    infants: int = Field(default=0, ge=0)
    pets: int = Field(default=0, ge=0)


class ListingSummaryForBooking(BaseModel):
    id: int
    title: str
    property_type: str
    room_type: str
    city: str
    state: str
    country: str
    cover_photo: Optional[str] = None
    avg_rating: float
    review_count: int

    model_config = ConfigDict(from_attributes=True)


class BookingConfirmationOut(BaseModel):
    id: int
    confirmation_code: str
    listing_id: int
    guest_id: int
    check_in: date
    check_out: date
    adults: int
    children: int
    infants: int
    pets: int
    nights: int

    # Price snapshot
    nightly_rate: int
    cleaning_fee: int
    service_fee: int
    taxes: int
    total_price: int

    status: str
    created_at: datetime
    listing: Optional[ListingSummaryForBooking] = None

    model_config = ConfigDict(from_attributes=True)


class TripsResponse(BaseModel):
    upcoming: List[BookingConfirmationOut]
    past: List[BookingConfirmationOut]


class BookingCancelResponse(BaseModel):
    id: int
    status: str
    confirmation_code: str
    message: str
