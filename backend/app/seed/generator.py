import random
from datetime import date, datetime, timedelta
from typing import Dict, List
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models import (
    Amenity,
    BlockedDate,
    Booking,
    Category,
    Listing,
    ListingPhoto,
    Review,
    User,
    WishlistItem,
)


def seed_reference_data(db: Session, categories_data: list, amenities_data: list, users_data: list):
    """Seeds base categories, amenities, and users."""
    categories = [Category(**c) for c in categories_data]
    amenities = [Amenity(**a) for a in amenities_data]
    users = [User(**u) for u in users_data]

    db.add_all(categories + amenities + users)
    db.commit()

    return (
        {c.slug: c for c in db.query(Category).all()},
        {a.name: a for a in db.query(Amenity).all()},
        db.query(User).all(),
    )


def seed_listings_with_photos(
    db: Session,
    listings_data: list,
    photos_pool: List[str],
    cat_map: Dict[str, Category],
    amenity_map: Dict[str, Amenity],
):
    """Inserts listings with photos, amenities, and categories."""
    amenity_list = list(amenity_map.values())
    cat_list = list(cat_map.values())
    photo_idx = 0

    listings_to_add = []
    for item in listings_data:
        listing = Listing(**item)

        # 1-3 categories tailored by city or property
        if "Goa" in listing.city:
            listing.categories = [cat_map.get("beachfront", cat_list[0]), cat_map.get("trending", cat_list[4])]
        elif "Manali" in listing.city:
            listing.categories = [cat_map.get("cabins", cat_list[1]), cat_map.get("amazing-views", cat_list[2])]
        elif "villa" in listing.property_type or "mansion" in listing.property_type:
            listing.categories = [cat_map.get("mansions", cat_list[9]), cat_map.get("design", cat_list[8])]
        else:
            listing.categories = [cat_map.get("trending", cat_list[4]), cat_map.get("rooms", cat_list[5])]

        # 10-16 amenities per listing
        sample_size = min(len(amenity_list), random.randint(10, 16))
        listing.amenities = random.sample(amenity_list, sample_size)

        # 5-7 photos per listing from pool
        photo_count = random.randint(5, 7)
        for pos in range(photo_count):
            url = photos_pool[photo_idx % len(photos_pool)]
            photo_idx += 1
            caption = "Cover photo" if pos == 0 else f"Interior view {pos}"
            listing.photos.append(ListingPhoto(url=url, caption=caption, position=pos))

        listings_to_add.append(listing)

    db.add_all(listings_to_add)
    db.commit()
    return db.query(Listing).all()


def seed_reviews_data(db: Session, listings: List[Listing], guests: List[User], templates: List[str]):
    """Generates ~250 realistic reviews across listings with sub-ratings."""
    reviews = []
    for i, listing in enumerate(listings):
        # Uneven distribution: first 15 listings get 8-15 reviews, rest get 1-4
        count = random.randint(8, 15) if i < 15 else random.randint(1, 4)
        for _ in range(count):
            guest = random.choice(guests)
            clean = random.choice([5, 5, 5, 4])
            acc = random.choice([5, 5, 4])
            check = 5
            comm = random.choice([5, 5, 4])
            loc = random.choice([5, 5, 4, 4])
            val = random.choice([5, 4, 4, 5])
            overall = round((clean + acc + check + comm + loc + val) / 6.0)

            comment = random.choice(templates)
            days_ago = random.randint(5, 300)
            created = datetime.utcnow() - timedelta(days=days_ago)

            reviews.append(
                Review(
                    listing_id=listing.id,
                    author_id=guest.id,
                    rating=overall,
                    cleanliness=clean,
                    accuracy=acc,
                    check_in_rating=check,
                    communication=comm,
                    location_rating=loc,
                    value_rating=val,
                    comment=comment,
                    created_at=created,
                )
            )

    db.add_all(reviews)
    db.commit()


def seed_bookings_and_blocks(db: Session, listings: List[Listing], guests: List[User]):
    """Generates ~40 bookings (past + active future) and host date blocks."""
    today = date.today()
    bookings = []
    confirmation_codes = set()

    def generate_code(idx):
        code = f"HM{idx:03d}{random.randint(100, 999)}R"
        while code in confirmation_codes:
            code = f"HM{random.randint(1000, 9999)}R"
        confirmation_codes.add(code)
        return code

    # Prominent future bookings for demo listing 1 & 2
    future_pairs = [
        (listings[0], today + timedelta(days=4), today + timedelta(days=7)),
        (listings[0], today + timedelta(days=12), today + timedelta(days=15)),
        (listings[1], today + timedelta(days=5), today + timedelta(days=8)),
        (listings[2], today + timedelta(days=7), today + timedelta(days=10)),
    ]

    for idx, (lst, cin, cout) in enumerate(future_pairs, start=1):
        nights = (cout - cin).days
        subtotal = lst.price_per_night * nights
        clean = lst.cleaning_fee
        serv = round(subtotal * 0.14)
        tax = round((subtotal + clean) * 0.05)
        total = subtotal + clean + serv + tax

        bookings.append(
            Booking(
                confirmation_code=generate_code(idx),
                listing_id=lst.id,
                guest_id=guests[idx % len(guests)].id,
                check_in=cin,
                check_out=cout,
                adults=2,
                nights=nights,
                nightly_rate=lst.price_per_night,
                cleaning_fee=clean,
                service_fee=serv,
                taxes=tax,
                total_price=total,
                status="confirmed",
            )
        )

    # 36 past completed bookings across other listings
    for idx in range(len(future_pairs) + 1, 41):
        lst = listings[idx % len(listings)]
        guest = guests[idx % len(guests)]
        days_ago = random.randint(10, 180)
        cin = today - timedelta(days=days_ago + 3)
        cout = today - timedelta(days=days_ago)
        nights = 3
        subtotal = lst.price_per_night * nights
        clean = lst.cleaning_fee
        serv = round(subtotal * 0.14)
        tax = round((subtotal + clean) * 0.05)
        total = subtotal + clean + serv + tax

        bookings.append(
            Booking(
                confirmation_code=generate_code(idx),
                listing_id=lst.id,
                guest_id=guest.id,
                check_in=cin,
                check_out=cout,
                adults=random.randint(1, min(lst.max_guests, 4)),
                nights=nights,
                nightly_rate=lst.price_per_night,
                cleaning_fee=clean,
                service_fee=serv,
                taxes=tax,
                total_price=total,
                status="completed",
            )
        )

    # Add blocked dates for listing 3
    blocked = [
        BlockedDate(listing_id=listings[2].id, date=today + timedelta(days=20 + d))
        for d in range(3)
    ]

    # Add sample wishlist items for guests
    wishlists = [
        WishlistItem(user_id=guests[0].id, listing_id=listings[0].id),
        WishlistItem(user_id=guests[0].id, listing_id=listings[3].id),
        WishlistItem(user_id=guests[1].id, listing_id=listings[1].id),
        WishlistItem(user_id=guests[1].id, listing_id=listings[5].id),
    ]

    db.add_all(bookings + blocked + wishlists)
    db.commit()


def recompute_listing_ratings(db: Session):
    """Recomputes denormalized avg_rating and review_count for all listings."""
    stats = (
        db.query(
            Review.listing_id,
            func.avg(Review.rating).label("avg_rating"),
            func.count(Review.id).label("review_count"),
        )
        .group_by(Review.listing_id)
        .all()
    )

    for listing_id, avg_r, count in stats:
        db.query(Listing).filter_by(id=listing_id).update(
            {"avg_rating": round(float(avg_r), 2), "review_count": int(count)}
        )
    db.commit()
