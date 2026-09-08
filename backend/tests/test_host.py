from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.database import SessionLocal
from app.main import app
from app.models import Booking, Listing, User

client = TestClient(app)


def get_token_for(email: str) -> str:
    res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    return res.json()["access_token"]


def test_host_endpoints_authorization_guards():
    # 1. Unauthenticated -> 401
    assert client.get("/api/host/listings").status_code == 401
    assert client.post("/api/host/listings", json={}).status_code == 401
    assert client.get("/api/host/reservations").status_code == 401

    # 2. Guest user -> 403 Forbidden
    guest_token = get_token_for("rahul.guest@airbnb.test")
    g_header = {"Authorization": f"Bearer {guest_token}"}
    assert client.get("/api/host/listings", headers=g_header).status_code == 403
    assert client.post("/api/host/listings", json={}, headers=g_header).status_code == 403
    assert client.get("/api/host/reservations", headers=g_header).status_code == 403


def test_get_host_listings_and_reservations():
    # Priya Sharma is host of listing 1
    host_token = get_token_for("priya.host@airbnb.test")
    headers = {"Authorization": f"Bearer {host_token}"}

    # 1. Get host listings
    res = client.get("/api/host/listings", headers=headers)
    assert res.status_code == 200
    listings = res.json()
    assert len(listings) > 0
    first = listings[0]
    assert "id" in first
    assert "title" in first
    assert "cover_photo" in first
    assert "total_reservations" in first
    assert "total_earnings" in first

    # 2. Get host reservations
    res_bks = client.get("/api/host/reservations", headers=headers)
    assert res_bks.status_code == 200
    reservations = res_bks.json()
    assert isinstance(reservations, list)
    if reservations:
        r0 = reservations[0]
        assert "confirmation_code" in r0
        assert "guest" in r0
        assert "name" in r0["guest"]
        assert "listing_title" in r0


def test_host_listing_lifecycle_create_update_delete():
    host1_token = get_token_for("priya.host@airbnb.test")
    host2_token = get_token_for("arjun.host@airbnb.test")
    h1 = {"Authorization": f"Bearer {host1_token}"}
    h2 = {"Authorization": f"Bearer {host2_token}"}

    created_id = None
    try:
        # 1. Create listing
        payload = {
            "title": "Modern Studio in Cyber City",
            "description": "Luxurious smart apartment in the heart of Gurgaon tech hub.",
            "property_type": "flat",
            "room_type": "entire",
            "address": "DLF Cyber City Phase 2",
            "city": "Gurugram",
            "state": "Haryana",
            "country": "India",
            "latitude": 28.495,
            "longitude": 77.089,
            "price_per_night": 6500,
            "cleaning_fee": 800,
            "max_guests": 2,
            "bedrooms": 1,
            "beds": 1,
            "bathrooms": 1.0,
            "photo_urls": [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
            ],
            "amenity_ids": [1, 2, 3],
            "category_ids": [1, 2],
        }
        res_create = client.post("/api/host/listings", json=payload, headers=h1)
        assert res_create.status_code == 201
        data = res_create.json()
        assert data["title"] == payload["title"]
        assert data["price_per_night"] == 6500
        assert data["is_active"] is True
        created_id = data["id"]

        # 2. Update listing by owner -> 200
        res_update = client.patch(
            f"/api/host/listings/{created_id}",
            json={"price_per_night": 7200, "title": "Updated Modern Studio"},
            headers=h1,
        )
        assert res_update.status_code == 200
        assert res_update.json()["price_per_night"] == 7200
        assert res_update.json()["title"] == "Updated Modern Studio"

        # 3. Update listing by different host -> 403 Forbidden
        res_forbidden_update = client.patch(
            f"/api/host/listings/{created_id}",
            json={"price_per_night": 9999},
            headers=h2,
        )
        assert res_forbidden_update.status_code == 403

        # 4. Set blocked dates
        blocked_d = (date.today() + timedelta(days=120)).isoformat()
        res_block = client.put(
            f"/api/host/listings/{created_id}/blocked-dates",
            json={"dates": [blocked_d]},
            headers=h1,
        )
        assert res_block.status_code == 200
        assert blocked_d in res_block.json()

        # Blocked dates by other host -> 403
        res_block_403 = client.put(
            f"/api/host/listings/{created_id}/blocked-dates",
            json={"dates": [blocked_d]},
            headers=h2,
        )
        assert res_block_403.status_code == 403

        # 5. Delete by different host -> 403
        res_del_403 = client.delete(f"/api/host/listings/{created_id}", headers=h2)
        assert res_del_403.status_code == 403

        # 6. Hard delete (no bookings exist yet) -> 200, soft_deleted=False
        res_hard_del = client.delete(f"/api/host/listings/{created_id}", headers=h1)
        assert res_hard_del.status_code == 200
        assert res_hard_del.json()["deleted"] is True
        assert res_hard_del.json()["soft_deleted"] is False
        created_id = None
    finally:
        if created_id:
            db = SessionLocal()
            listing = db.query(Listing).filter(Listing.id == created_id).first()
            if listing:
                db.delete(listing)
                db.commit()
            db.close()


def test_soft_delete_when_bookings_exist():
    # Listing 1 has existing bookings in seed data
    db = SessionLocal()
    lst1 = db.query(Listing).filter(Listing.id == 1).first()
    assert lst1 is not None
    assert len(lst1.bookings) > 0
    host = db.query(User).filter(User.id == lst1.host_id).first()
    db.close()

    host_token = get_token_for(host.email)
    h = {"Authorization": f"Bearer {host_token}"}

    try:
        # Delete listing 1
        res = client.delete("/api/host/listings/1", headers=h)
        assert res.status_code == 200
        del_data = res.json()
        assert del_data["deleted"] is True
        assert del_data["soft_deleted"] is True
        assert "deactivated" in del_data["message"].lower()

        # Verify listing 1 is now inactive
        db = SessionLocal()
        reloaded = db.query(Listing).filter(Listing.id == 1).first()
        assert reloaded.is_active is False
        # Verify bookings are still intact
        assert len(reloaded.bookings) > 0
        db.close()
    finally:
        # Restore is_active=True for listing 1 so other tests are not impacted
        db = SessionLocal()
        lst1_restore = db.query(Listing).filter(Listing.id == 1).first()
        if lst1_restore:
            lst1_restore.is_active = True
            db.commit()
        db.close()
