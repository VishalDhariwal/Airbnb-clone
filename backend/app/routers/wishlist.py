from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from app.core.deps import get_current_user
from app.database import get_db
from app.models import Listing, User, WishlistItem
from app.schemas.listing import ListingCardOut, ListingPhotoOut

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=List[ListingCardOut])
def get_user_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns full property card data for all listings saved by current user."""
    items = (
        db.query(Listing)
        .join(WishlistItem, WishlistItem.listing_id == Listing.id)
        .filter(WishlistItem.user_id == current_user.id, Listing.is_active.is_(True))
        .options(selectinload(Listing.photos))
        .order_by(WishlistItem.created_at.desc())
        .all()
    )

    cards = []
    for l in items:
        sorted_photos = sorted(l.photos, key=lambda p: p.position)
        photos_out = [ListingPhotoOut.model_validate(p) for p in sorted_photos]
        subtotal = l.price_per_night * 2
        fee = round(subtotal * 0.14)
        tax = round((subtotal + l.cleaning_fee) * 0.05)
        trip_total = subtotal + l.cleaning_fee + fee + tax

        cards.append(
            ListingCardOut(
                id=l.id,
                title=l.title,
                property_type=l.property_type,
                room_type=l.room_type,
                city=l.city,
                state=l.state,
                country=l.country,
                latitude=l.latitude,
                longitude=l.longitude,
                price_per_night=l.price_per_night,
                total_price=trip_total,
                nights=2,
                avg_rating=l.avg_rating,
                review_count=l.review_count,
                is_guest_favorite=l.is_guest_favorite,
                photos=photos_out,
            )
        )
    return cards


@router.get("/ids", response_model=List[int])
def get_wishlist_ids(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns an array of saved listing IDs for O(1) active heart button rendering."""
    rows = (
        db.query(WishlistItem.listing_id)
        .filter(WishlistItem.user_id == current_user.id)
        .all()
    )
    return [r[0] for r in rows]


@router.post("/{listing_id}")
def add_to_wishlist(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Adds a listing to the current user's wishlist (idempotent)."""
    listing = db.query(Listing.id).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    existing = (
        db.query(WishlistItem)
        .filter(
            WishlistItem.user_id == current_user.id,
            WishlistItem.listing_id == listing_id,
        )
        .first()
    )
    if not existing:
        item = WishlistItem(user_id=current_user.id, listing_id=listing_id)
        db.add(item)
        db.commit()

    return {"status": "ok", "saved": True, "listing_id": listing_id}


@router.delete("/{listing_id}")
def remove_from_wishlist(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Removes a listing from the current user's wishlist."""
    item = (
        db.query(WishlistItem)
        .filter(
            WishlistItem.user_id == current_user.id,
            WishlistItem.listing_id == listing_id,
        )
        .first()
    )
    if item:
        db.delete(item)
        db.commit()

    return {"status": "ok", "saved": False, "listing_id": listing_id}
