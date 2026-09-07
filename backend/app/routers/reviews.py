from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload
from app.database import get_db
from app.models import Listing, Review
from app.schemas.review import AuthorSummaryOut, ReviewListResponse, ReviewOut

router = APIRouter(prefix="/listings", tags=["Reviews"])


@router.get("/{listing_id}/reviews", response_model=ReviewListResponse)
def get_listing_reviews(
    listing_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Returns paginated reviews and sub-rating averages for a listing."""
    listing = db.query(Listing.id).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    query = (
        db.query(Review)
        .options(selectinload(Review.author))
        .filter(Review.listing_id == listing_id)
        .order_by(Review.created_at.desc())
    )

    total = query.count()
    offset = (page - 1) * limit
    reviews = query.offset(offset).limit(limit).all()

    # Calculate sub-rating averages
    sub_averages = (
        db.query(
            func.avg(Review.cleanliness).label("cleanliness"),
            func.avg(Review.accuracy).label("accuracy"),
            func.avg(Review.check_in_rating).label("check_in"),
            func.avg(Review.communication).label("communication"),
            func.avg(Review.location_rating).label("location"),
            func.avg(Review.value_rating).label("value"),
        )
        .filter(Review.listing_id == listing_id)
        .first()
    )

    averages_dict = {
        "cleanliness": round(float(sub_averages.cleanliness or 5.0), 1),
        "accuracy": round(float(sub_averages.accuracy or 5.0), 1),
        "check_in": round(float(sub_averages.check_in or 5.0), 1),
        "communication": round(float(sub_averages.communication or 5.0), 1),
        "location": round(float(sub_averages.location or 5.0), 1),
        "value": round(float(sub_averages.value or 5.0), 1),
    }

    items = [
        ReviewOut(
            id=r.id,
            listing_id=r.listing_id,
            author=AuthorSummaryOut(
                id=r.author.id, name=r.author.name, avatar_url=r.author.avatar_url
            ),
            rating=r.rating,
            cleanliness=r.cleanliness,
            accuracy=r.accuracy,
            check_in_rating=r.check_in_rating,
            communication=r.communication,
            location_rating=r.location_rating,
            value_rating=r.value_rating,
            comment=r.comment,
            created_at=r.created_at,
        )
        for r in reviews
    ]

    return ReviewListResponse(
        items=items, total=total, page=page, limit=limit, sub_rating_averages=averages_dict
    )
