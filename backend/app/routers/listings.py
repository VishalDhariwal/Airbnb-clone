from collections import defaultdict
from datetime import date, timedelta
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from app.database import get_db
from app.models import Listing
from app.schemas.common import PaginatedResponse
from app.schemas.listing import (
    AmenityOut,
    AvailabilityResponse,
    CategoryOut,
    HomeSectionOut,
    HostSummaryOut,
    ListingCardOut,
    ListingDetailOut,
    ListingPhotoOut,
    QuoteRequest,
    QuoteResponse,
)
from app.services.availability import check_range_availability, get_unavailable_dates
from app.services.pricing import calculate_price_breakdown
from app.services.search import search_listings

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.get("", response_model=PaginatedResponse[ListingCardOut])
def get_listings(
    location: Optional[str] = Query(None),
    check_in: Optional[date] = Query(None),
    check_out: Optional[date] = Query(None),
    guests: Optional[int] = Query(None, ge=1),
    min_price: Optional[int] = Query(None, ge=0),
    max_price: Optional[int] = Query(None, ge=0),
    property_type: Optional[List[str]] = Query(None),
    room_type: Optional[str] = Query(None),
    amenities: Optional[List[int]] = Query(None),
    category: Optional[str] = Query(None),
    bedrooms: Optional[int] = Query(None, ge=0),
    beds: Optional[int] = Query(None, ge=0),
    bathrooms: Optional[float] = Query(None, ge=0),
    sort: str = Query("recommended"),
    page: int = Query(1, ge=1),
    limit: int = Query(18, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Search and filter listings with full parameter support and pagination."""
    items, total = search_listings(
        db=db,
        location=location,
        check_in=check_in,
        check_out=check_out,
        guests=guests,
        min_price=min_price,
        max_price=max_price,
        property_type=property_type,
        room_type=room_type,
        amenities=amenities,
        category=category,
        bedrooms=bedrooms,
        beds=beds,
        bathrooms=bathrooms,
        sort=sort,
        page=page,
        limit=limit,
    )
    has_more = (page * limit) < total
    return PaginatedResponse(items=items, total=total, page=page, limit=limit, has_more=has_more)


@router.get("/home-sections", response_model=List[HomeSectionOut])
def get_home_sections(db: Session = Depends(get_db)):
    """Returns curated horizontal carousel sections for the homepage (matches reference 01/02)."""
    sections = [
        ("north-goa", "Popular homes in North Goa", "Goa"),
        ("dehradun", "Available in Dehradun this weekend", "Dehradun"),
        ("new-delhi", "Stay in New Delhi", "New Delhi"),
        ("gurugram", "Available in Gurgaon District this weekend", "Gurugram"),
    ]
    results = []
    for sec_id, title, city in sections:
        items, _ = search_listings(db=db, location=city, page=1, limit=8)
        results.append(HomeSectionOut(id=sec_id, title=title, items=items))
    return results


@router.get("/{listing_id}", response_model=ListingDetailOut)
def get_listing_detail(listing_id: int, db: Session = Depends(get_db)):
    """Fetches complete listing detail graph in a single network round trip."""
    listing = (
        db.query(Listing)
        .options(
            selectinload(Listing.photos),
            selectinload(Listing.amenities),
            selectinload(Listing.categories),
            selectinload(Listing.host),
        )
        .filter(Listing.id == listing_id, Listing.is_active.is_(True))
        .first()
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    sorted_photos = sorted(listing.photos, key=lambda p: p.position)
    photos_out = [ListingPhotoOut.model_validate(p) for p in sorted_photos]

    # Group amenities by category
    grouped: Dict[str, List[AmenityOut]] = defaultdict(list)
    amenities_out = []
    for a in listing.amenities:
        a_out = AmenityOut.model_validate(a)
        amenities_out.append(a_out)
        grouped[a.category].append(a_out)

    categories_out = [CategoryOut.model_validate(c) for c in listing.categories]

    host_out = HostSummaryOut(
        id=listing.host.id,
        name=listing.host.name,
        avatar_url=listing.host.avatar_url,
        is_superhost=listing.host.is_superhost,
        bio=listing.host.bio,
        response_rate=listing.host.response_rate,
        joined_year=listing.host.joined_at.year if listing.host.joined_at else 2024,
    )

    # 2-night default trip total
    subtotal = listing.price_per_night * 2
    fee = round(subtotal * 0.14)
    tax = round((subtotal + listing.cleaning_fee) * 0.05)
    trip_total = subtotal + listing.cleaning_fee + fee + tax

    return ListingDetailOut(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        property_type=listing.property_type,
        room_type=listing.room_type,
        address=listing.address,
        city=listing.city,
        state=listing.state,
        country=listing.country,
        latitude=listing.latitude,
        longitude=listing.longitude,
        price_per_night=listing.price_per_night,
        total_price=trip_total,
        nights=2,
        cleaning_fee=listing.cleaning_fee,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        bathrooms=listing.bathrooms,
        avg_rating=listing.avg_rating,
        review_count=listing.review_count,
        is_guest_favorite=listing.is_guest_favorite,
        photos=photos_out,
        host=host_out,
        categories=categories_out,
        amenities=amenities_out,
        amenities_grouped=dict(grouped),
    )


@router.get("/{listing_id}/availability", response_model=AvailabilityResponse)
def get_listing_availability(
    listing_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """Returns all blocked and booked dates within the specified calendar window."""
    start = start_date or date.today()
    end = end_date or (date.today() + timedelta(days=90))

    listing = db.query(Listing.id).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    unavailable = get_unavailable_dates(db, listing_id, start, end)
    return AvailabilityResponse(
        listing_id=listing_id,
        start_date=start,
        end_date=end,
        unavailable_dates=unavailable,
    )


@router.post("/{listing_id}/quote", response_model=QuoteResponse)
def get_listing_quote(
    listing_id: int,
    payload: QuoteRequest,
    db: Session = Depends(get_db),
):
    """Computes authoritative server-side price breakdown and checks date availability."""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if payload.check_out <= payload.check_in:
        raise HTTPException(status_code=400, detail="check_out must be after check_in")

    pricing = calculate_price_breakdown(
        nightly_rate=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee,
        check_in=payload.check_in,
        check_out=payload.check_out,
    )
    is_avail = check_range_availability(db, listing_id, payload.check_in, payload.check_out)

    return QuoteResponse(
        listing_id=listing.id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests=payload.guests,
        nights=pricing["nights"],
        nightly_rate=pricing["nightly_rate"],
        subtotal=pricing["subtotal"],
        cleaning_fee=pricing["cleaning_fee"],
        service_fee=pricing["service_fee"],
        taxes=pricing["taxes"],
        total_price=pricing["total_price"],
        available=is_avail,
    )

