from datetime import date
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ListingPhotoOut(BaseModel):
    id: int
    url: str
    caption: Optional[str] = None
    position: int

    model_config = ConfigDict(from_attributes=True)


class AmenityOut(BaseModel):
    id: int
    name: str
    icon_key: str
    category: str

    model_config = ConfigDict(from_attributes=True)


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    icon_key: str

    model_config = ConfigDict(from_attributes=True)


class HostSummaryOut(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None
    is_superhost: bool
    bio: Optional[str] = None
    response_rate: Optional[int] = None
    joined_year: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class ListingCardOut(BaseModel):
    id: int
    title: str
    property_type: str
    room_type: str
    city: str
    state: str
    country: str
    latitude: float
    longitude: float
    price_per_night: int
    total_price: int
    nights: int
    avg_rating: float
    review_count: int
    is_guest_favorite: bool
    photos: List[ListingPhotoOut] = []

    model_config = ConfigDict(from_attributes=True)


class ListingDetailOut(ListingCardOut):
    description: str
    cleaning_fee: int
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: float
    host: HostSummaryOut
    categories: List[CategoryOut] = []
    amenities: List[AmenityOut] = []
    amenities_grouped: Dict[str, List[AmenityOut]] = {}

    model_config = ConfigDict(from_attributes=True)


class QuoteRequest(BaseModel):
    check_in: date
    check_out: date
    guests: int = Field(default=1, ge=1)


class QuoteResponse(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests: int
    nights: int
    nightly_rate: int
    subtotal: int
    cleaning_fee: int
    service_fee: int
    taxes: int
    total_price: int
    available: bool


class AvailabilityResponse(BaseModel):
    listing_id: int
    start_date: date
    end_date: date
    unavailable_dates: List[str]


class HomeSectionOut(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    items: List[ListingCardOut]
