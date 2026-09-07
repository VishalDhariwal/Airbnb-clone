import argparse
import json
import os
from pathlib import Path
from app.database import Base, SessionLocal, engine
from app.models import Listing
from app.seed.generator import (
    recompute_listing_ratings,
    seed_bookings_and_blocks,
    seed_listings_with_photos,
    seed_reference_data,
    seed_reviews_data,
)

DATA_DIR = Path(__file__).parent / "data"


def load_json(filename: str):
    """Loads a JSON file from the seed data directory."""
    filepath = DATA_DIR / filename
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def run_seed(reset: bool = False):
    """Executes database seeding."""
    if reset:
        print("Resetting database schema...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if listings already exist
        if db.query(Listing).count() > 0 and not reset:
            print("Database already contains data. Use --reset to drop and rebuild.")
            return

        print("Loading seed datasets...")
        categories_data = load_json("categories.json")
        amenities_data = load_json("amenities.json")
        users_data = load_json("users.json")
        photos_pool = load_json("photos.json")
        listings_data = load_json("listings.json")
        review_templates = load_json("reviews_template.json")

        print("1/5 Seeding categories, amenities, and users...")
        cat_map, amenity_map, users = seed_reference_data(
            db, categories_data, amenities_data, users_data
        )

        print(f"2/5 Seeding {len(listings_data)} listings with photos...")
        listings = seed_listings_with_photos(
            db, listings_data, photos_pool, cat_map, amenity_map
        )

        print("3/5 Seeding reviews and ratings...")
        guests = [u for u in users if not u.is_host]
        seed_reviews_data(db, listings, guests, review_templates)

        print("4/5 Seeding bookings, blocked dates, and wishlist items...")
        seed_bookings_and_blocks(db, listings, guests)

        print("5/5 Recomputing listing ratings and reviews aggregates...")
        recompute_listing_ratings(db)

        # Print summary
        total_listings = db.query(Listing).count()
        print(f"\nSeeding successfully finished!")
        print(f"  - Users: {len(users)}")
        print(f"  - Listings: {total_listings}")
        print(f"  - Categories: {len(cat_map)}")
        print(f"  - Amenities: {len(amenity_map)}")
        print(f"  - Photos pool: {len(photos_pool)}")

    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Airbnb clone SQLite database.")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Drop and recreate all database tables before seeding",
    )
    args = parser.parse_args()
    run_seed(reset=args.reset)
