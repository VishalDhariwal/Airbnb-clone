from datetime import date
from typing import List, Optional, Tuple
from sqlalchemy import desc, exists, func, or_, select
from sqlalchemy.orm import Session, selectinload
from app.models import (
    BlockedDate,
    Booking,
    Category,
    Listing,
    ListingPhoto,
    listing_amenities,
    listing_categories,
)
from app.schemas.listing import ListingCardOut, ListingPhotoOut
from app.services.pricing import calculate_price_breakdown


def search_listings(
    db: Session,
    location: Optional[str] = None,
    check_in: Optional[date] = None,
    check_out: Optional[date] = None,
    guests: Optional[int] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    property_type: Optional[List[str]] = None,
    room_type: Optional[str] = None,
    amenities: Optional[List[int]] = None,
    category: Optional[str] = None,
    bedrooms: Optional[int] = None,
    beds: Optional[int] = None,
    bathrooms: Optional[float] = None,
    sort: str = "recommended",
    page: int = 1,
    limit: int = 18,
) -> Tuple[List[ListingCardOut], int]:
    """
    Search and filter listings with date availability and N+1 prevention (§1.3).
    """
    query = db.query(Listing).filter(Listing.is_active.is_(True))

    # 1. Location search (forgiving ILIKE/LIKE across city, state, address)
    if location and location.strip():
        term = f"%{location.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Listing.city).like(term),
                func.lower(Listing.state).like(term),
                func.lower(Listing.address).like(term),
                func.lower(Listing.title).like(term),
            )
        )

    # 2. Capacity & Rooms
    if guests and guests > 0:
        query = query.filter(Listing.max_guests >= guests)
    if bedrooms and bedrooms > 0:
        query = query.filter(Listing.bedrooms >= bedrooms)
    if beds and beds > 0:
        query = query.filter(Listing.beds >= beds)
    if bathrooms and bathrooms > 0:
        query = query.filter(Listing.bathrooms >= bathrooms)

    # 3. Price range (INR per night)
    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)

    # 4. Property & Room types
    if property_type:
        query = query.filter(Listing.property_type.in_(property_type))
    if room_type:
        query = query.filter(Listing.room_type == room_type)

    # 5. Category filter
    if category and category.strip():
        query = query.join(Listing.categories).filter(Category.slug == category.strip())

    # 6. Amenities filter (listing must include all requested amenities)
    if amenities:
        for amen_id in amenities:
            amenity_subquery = select(1).select_from(listing_amenities).where(
                listing_amenities.c.listing_id == Listing.id,
                listing_amenities.c.amenity_id == amen_id,
            )
            query = query.filter(exists(amenity_subquery))

    # 7. Date availability: Exclude listings with confirmed bookings or host blocks
    if check_in and check_out and check_out > check_in:
        booking_overlap = select(1).select_from(Booking).where(
            Booking.listing_id == Listing.id,
            Booking.status == "confirmed",
            Booking.check_in < check_out,
            Booking.check_out > check_in,
        )
        query = query.filter(~exists(booking_overlap))

        blocked_overlap = select(1).select_from(BlockedDate).where(
            BlockedDate.listing_id == Listing.id,
            BlockedDate.date >= check_in,
            BlockedDate.date < check_out,
        )
        query = query.filter(~exists(blocked_overlap))

    # Total count before pagination
    total = query.count()

    # 8. Sorting
    if sort == "price_asc":
        query = query.order_by(Listing.price_per_night.asc())
    elif sort == "price_desc":
        query = query.order_by(Listing.price_per_night.desc())
    elif sort == "rating":
        query = query.order_by(desc(Listing.avg_rating), desc(Listing.review_count))
    else:  # "recommended" default
        query = query.order_by(
            desc(Listing.is_guest_favorite),
            desc(Listing.avg_rating),
            desc(Listing.review_count),
            Listing.id.asc(),
        )

    # 9. Pagination & Eager Loading (prevent N+1 on photos)
    offset = max(0, (page - 1) * limit)
    db_items = (
        query.options(selectinload(Listing.photos))
        .offset(offset)
        .limit(limit)
        .all()
    )

    # 10. Transform into card view with computed trip price
    cards: List[ListingCardOut] = []
    nights = (check_out - check_in).days if (check_in and check_out and check_out > check_in) else 2

    for l in db_items:
        # Sort photos by position
        sorted_photos = sorted(l.photos, key=lambda p: p.position)
        photos_out = [ListingPhotoOut.model_validate(p) for p in sorted_photos]

        # Calculate trip total
        if check_in and check_out and check_out > check_in:
            pricing = calculate_price_breakdown(l.price_per_night, l.cleaning_fee, check_in, check_out)
            trip_total = pricing["total_price"]
        else:
            # Default 2-night total
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
                nights=nights,
                avg_rating=l.avg_rating,
                review_count=l.review_count,
                is_guest_favorite=l.is_guest_favorite,
                photos=photos_out,
            )
        )

    return cards, total
