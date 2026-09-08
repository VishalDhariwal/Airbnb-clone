from datetime import date, datetime
import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from app.database import Base
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


@pytest.fixture
def test_db():
    """In-memory SQLite database session with foreign key enforcement enabled."""
    engine = create_engine("sqlite:///:memory:", echo=False)

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_user_and_listing_relationships(test_db):
    host = User(
        name="Priya Sharma",
        email="priya@example.com",
        is_host=True,
        is_superhost=True,
    )
    test_db.add(host)
    test_db.commit()

    listing = Listing(
        host_id=host.id,
        title="Luxury Villa in North Goa",
        description="A stunning private pool villa in Anjuna.",
        property_type="villa",
        room_type="entire",
        address="123 Anjuna Beach Road",
        city="Goa",
        state="Goa",
        country="India",
        latitude=15.58,
        longitude=73.74,
        price_per_night=15000,
        cleaning_fee=1500,
        max_guests=6,
        bedrooms=3,
        beds=3,
        bathrooms=3.5,
        is_guest_favorite=True,
        avg_rating=4.95,
        review_count=24,
    )
    test_db.add(listing)
    test_db.commit()

    # Verify relationship navigation
    assert len(host.listings) == 1
    assert host.listings[0].title == "Luxury Villa in North Goa"
    assert listing.host.name == "Priya Sharma"


def test_foreign_key_enforcement(test_db):
    """Inserting a listing with a nonexistent host_id must fail under PRAGMA foreign_keys=ON."""
    invalid_listing = Listing(
        host_id=999999,  # Non-existent
        title="Ghost Listing",
        description="Should fail FK check",
        property_type="flat",
        room_type="entire",
        address="Nowhere",
        city="Nowhere",
        state="Nowhere",
        country="India",
        latitude=0.0,
        longitude=0.0,
        price_per_night=5000,
        cleaning_fee=500,
        max_guests=2,
        bedrooms=1,
        beds=1,
        bathrooms=1.0,
    )
    test_db.add(invalid_listing)
    with pytest.raises(IntegrityError):
        test_db.commit()
    test_db.rollback()


def test_amenities_and_categories_many_to_many(test_db):
    host = User(name="Rohit", email="rohit@example.com", is_host=True)
    test_db.add(host)
    test_db.commit()

    listing = Listing(
        host_id=host.id,
        title="Modern Apartment in Noida",
        description="Sector 63 modern flat",
        property_type="flat",
        room_type="entire",
        address="Sector 63",
        city="Noida",
        state="Uttar Pradesh",
        country="India",
        latitude=28.62,
        longitude=77.38,
        price_per_night=4500,
        cleaning_fee=400,
        max_guests=4,
        bedrooms=2,
        beds=2,
        bathrooms=2.0,
    )
    wifi = Amenity(name="Wifi", icon_key="wifi", category="essentials")
    pool = Amenity(name="Pool", icon_key="pool", category="features")
    beachfront = Category(name="Beachfront", slug="beachfront", icon_key="beach")

    listing.amenities.extend([wifi, pool])
    listing.categories.append(beachfront)
    test_db.add_all([listing, wifi, pool, beachfront])
    test_db.commit()

    # Re-query
    queried = test_db.query(Listing).filter_by(id=listing.id).first()
    assert len(queried.amenities) == 2
    assert {a.name for a in queried.amenities} == {"Wifi", "Pool"}
    assert len(queried.categories) == 1
    assert queried.categories[0].slug == "beachfront"


def test_booking_price_snapshot_and_cascade(test_db):
    host = User(name="Host Vikram", email="vikram@example.com", is_host=True)
    guest = User(name="Guest Anita", email="anita@example.com")
    test_db.add_all([host, guest])
    test_db.commit()

    listing = Listing(
        host_id=host.id,
        title="Cozy Cottage in Manali",
        description="Mountain view cottage",
        property_type="house",
        room_type="entire",
        address="Old Manali",
        city="Manali",
        state="Himachal Pradesh",
        country="India",
        latitude=32.24,
        longitude=77.18,
        price_per_night=6000,
        cleaning_fee=600,
        max_guests=4,
        bedrooms=2,
        beds=2,
        bathrooms=1.0,
    )
    test_db.add(listing)
    test_db.commit()

    # Create photo
    photo = ListingPhoto(listing_id=listing.id, url="https://images.unsplash.com/sample", position=0)
    test_db.add(photo)

    # Create booking with price snapshot
    booking = Booking(
        confirmation_code="HMXK4P2R",
        listing_id=listing.id,
        guest_id=guest.id,
        check_in=date(2026, 10, 1),
        check_out=date(2026, 10, 5),
        adults=2,
        nights=4,
        nightly_rate=6000,
        cleaning_fee=600,
        service_fee=3360,
        taxes=1368,
        total_price=29328,
        status="confirmed",
    )
    test_db.add(booking)
    test_db.commit()

    assert booking.id is not None
    assert booking.total_price == 29328

    # Verify photo cascade: if a listing without bookings is deleted, photos are deleted
    listing2 = Listing(
        host_id=host.id,
        title="Temporary Studio",
        description="Studio for cascade test",
        property_type="flat",
        room_type="entire",
        address="MG Road",
        city="Bengaluru",
        state="Karnataka",
        country="India",
        latitude=12.97,
        longitude=77.59,
        price_per_night=3000,
        max_guests=2,
        bedrooms=1,
        beds=1,
        bathrooms=1.0,
    )
    test_db.add(listing2)
    test_db.commit()
    photo2 = ListingPhoto(listing_id=listing2.id, url="https://images.unsplash.com/studio", position=0)
    test_db.add(photo2)
    test_db.commit()

    photo2_id = photo2.id
    test_db.delete(listing2)
    test_db.commit()

    # Photo2 must have been deleted via cascade
    assert test_db.query(ListingPhoto).filter_by(id=photo2_id).first() is None


def test_unique_constraints(test_db):
    user = User(name="Sameer", email="sameer@example.com")
    test_db.add(user)
    test_db.commit()

    listing = Listing(
        host_id=user.id,
        title="Test Unique Constraints",
        description="Desc",
        property_type="flat",
        room_type="entire",
        address="Road 1",
        city="Delhi",
        state="Delhi",
        country="India",
        latitude=28.6,
        longitude=77.2,
        price_per_night=2000,
        max_guests=2,
        bedrooms=1,
        beds=1,
        bathrooms=1.0,
    )
    test_db.add(listing)
    test_db.commit()

    # Wishlist uniqueness
    w1 = WishlistItem(user_id=user.id, listing_id=listing.id)
    test_db.add(w1)
    test_db.commit()

    w2 = WishlistItem(user_id=user.id, listing_id=listing.id)
    test_db.add(w2)
    with pytest.raises(IntegrityError):
        test_db.commit()
    test_db.rollback()

    # BlockedDate uniqueness
    b1 = BlockedDate(listing_id=listing.id, date=date(2026, 11, 15))
    test_db.add(b1)
    test_db.commit()

    b2 = BlockedDate(listing_id=listing.id, date=date(2026, 11, 15))
    test_db.add(b2)
    with pytest.raises(IntegrityError):
        test_db.commit()
    test_db.rollback()
