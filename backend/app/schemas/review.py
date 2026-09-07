from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class AuthorSummaryOut(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ReviewOut(BaseModel):
    id: int
    listing_id: int
    author: AuthorSummaryOut
    rating: int
    cleanliness: int
    accuracy: int
    check_in_rating: int
    communication: int
    location_rating: int
    value_rating: int
    comment: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewListResponse(BaseModel):
    items: List[ReviewOut]
    total: int
    page: int
    limit: int
    sub_rating_averages: Dict[str, float]
