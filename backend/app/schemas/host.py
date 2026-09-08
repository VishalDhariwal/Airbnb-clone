from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class HostListingCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    property_type: str
    room_type: str
    address: str
    city: str
    state: str
    country: str = "India"
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    price_per_night: int = Field(..., ge=100)
    cleaning_fee: int = Field(default=0, ge=0)
    max_guests: int = Field(default=2, ge=1)
    bedrooms: int = Field(default=1, ge=0)
    beds: int = Field(default=1, ge=1)
    bathrooms: float = Field(default=1.0, ge=0.5)
    photo_urls: List[str] = Field(..., min_length=1)
    amenity_ids: List[int] = Field(default_factory=list)
    category_ids: List[int] = Field(default_factory=list)


class HostListingUpdateRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=255)
    description: Optional[str] = Field(default=None, min_length=10)
    property_type: Optional[str] = None
    room_type: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    price_per_night: Optional[int] = Field(default=None, ge=100)
    cleaning_fee: Optional[int] = Field(default=None, ge=0)
    max_guests: Optional[int] = Field(default=None, ge=1)
    bedrooms: Optional[int] = Field(default=None, ge=0)
    beds: Optional[int] = Field(default=None, ge=1)
    bathrooms: Optional[float] = Field(default=None, ge=0.5)
    is_active: Optional[bool] = None
    photo_urls: Optional[List[str]] = None
    amenity_ids: Optional[List[int]] = None
    category_ids: Optional[List[int]] = None


class HostListingOut(BaseModel):
    id: int
    title: str
    property_type: str
    room_type: str
    address: str
    city: str
    state: str
    country: str
    price_per_night: int
    cleaning_fee: int
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: float
    is_active: bool
    cover_photo: Optional[str] = None
    avg_rating: float
    review_count: int
    total_reservations: int = 0
    total_earnings: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HostGuestSummary(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class HostReservationOut(BaseModel):
    id: int
    confirmation_code: str
    listing_id: int
    listing_title: str
    listing_city: str
    guest: HostGuestSummary
    check_in: date
    check_out: date
    adults: int
    children: int
    nights: int
    total_price: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HostBlockedDatesRequest(BaseModel):
    dates: List[date]


class HostDeleteResponse(BaseModel):
    id: int
    deleted: bool
    soft_deleted: bool
    message: str
