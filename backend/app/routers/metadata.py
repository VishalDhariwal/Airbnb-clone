from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Amenity, Category, Listing
from app.schemas.listing import AmenityOut, CategoryOut

router = APIRouter(tags=["Metadata"])


@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    """Returns all listing categories."""
    categories = db.query(Category).order_by(Category.id.asc()).all()
    return [CategoryOut.model_validate(c) for c in categories]


@router.get("/amenities", response_model=List[AmenityOut])
def get_amenities(db: Session = Depends(get_db)):
    """Returns all amenities with their icon keys and categories."""
    amenities = db.query(Amenity).order_by(Amenity.id.asc()).all()
    return [AmenityOut.model_validate(a) for a in amenities]


@router.get("/locations/suggest")
def suggest_locations(
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Returns location suggestions matching query string for the search bar 'Where' panel.
    """
    if not q or not q.strip():
        # Default popular destinations
        return [
            {"name": "Goa", "region": "Coastal getaways", "count": 10},
            {"name": "New Delhi", "region": "Heritage & dining", "count": 9},
            {"name": "Dehradun", "region": "Valley & hills", "count": 8},
            {"name": "Manali", "region": "Himalayan retreats", "count": 8},
            {"name": "Jaipur", "region": "Palaces & culture", "count": 8},
            {"name": "Mumbai", "region": "Urban & coastal", "count": 8},
        ]

    term = f"%{q.strip().lower()}%"
    cities = (
        db.query(Listing.city, func.count(Listing.id).label("count"))
        .filter(func.lower(Listing.city).like(term))
        .group_by(Listing.city)
        .order_by(func.count(Listing.id).desc())
        .limit(6)
        .all()
    )

    return [{"name": city, "region": "India", "count": count} for city, count in cities]
