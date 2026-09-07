from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
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

engine = create_engine(settings.DATABASE_URL)
Session = sessionmaker(bind=engine)


def test_seed_counts_and_distributions():
    db = Session()
    try:
        # 1. Users
        users = db.query(User).all()
        assert len(users) == 10
        superhosts = [u for u in users if u.is_superhost]
        assert len(superhosts) >= 4

        # 2. Categories & Amenities
        assert db.query(Category).count() == 10
        assert db.query(Amenity).count() == 30

        # 3. Listings
        listings = db.query(Listing).all()
        assert len(listings) >= 60, f"Expected 60+ listings, got {len(listings)}"

        cities = {l.city for l in listings}
        expected_cities = {"Goa", "Noida", "New Delhi", "Gurugram", "Dehradun", "Manali", "Jaipur", "Mumbai"}
        assert expected_cities.issubset(cities), f"Missing cities: {expected_cities - cities}"

        # 4. Photos, Amenities, Categories per listing
        for l in listings:
            assert 5 <= len(l.photos) <= 7, f"Listing {l.id} has {len(l.photos)} photos"
            positions = [p.position for p in l.photos]
            assert 0 in positions, f"Listing {l.id} missing position 0 cover photo"
            assert len(l.categories) >= 1, f"Listing {l.id} has no categories"
            assert len(l.amenities) >= 8, f"Listing {l.id} has insufficient amenities"
            assert l.price_per_night > 0, f"Listing {l.id} invalid price"

        # 5. Reviews and Ratings denormalization
        reviews_count = db.query(Review).count()
        assert reviews_count >= 200, f"Expected 200+ reviews, got {reviews_count}"

        for l in listings:
            if l.review_count > 0:
                assert 1.0 <= l.avg_rating <= 5.0, f"Listing {l.id} invalid avg_rating {l.avg_rating}"

        # 6. Bookings & Availability
        bookings = db.query(Booking).all()
        assert len(bookings) >= 35, f"Expected 35+ bookings, got {len(bookings)}"

        future_bookings = [b for b in bookings if b.check_in > date.today() and b.status == "confirmed"]
        assert len(future_bookings) >= 1, "Expected at least 1 confirmed future booking"

        # Ensure price snapshots are stored as non-zero integers
        for b in bookings:
            assert b.total_price > 0
            assert b.nightly_rate > 0
            assert b.confirmation_code.startswith("HM")

        # 7. Blocked Dates & Wishlists
        assert db.query(BlockedDate).count() > 0
        assert db.query(WishlistItem).count() > 0

    finally:
        db.close()
