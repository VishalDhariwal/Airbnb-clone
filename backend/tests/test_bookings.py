from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.database import SessionLocal
from app.main import app
from app.models import BlockedDate, Booking, Listing, User

client = TestClient(app)


def get_token_for(email: str) -> str:
    res = client.post("/api/auth/login", json={"email": email})
    return res.json()["access_token"]


def test_booking_unauthorized_endpoints():
    assert client.post("/api/bookings", json={}).status_code == 401
    assert client.get("/api/bookings/me").status_code == 401
    assert client.get("/api/bookings/1").status_code == 401
    assert client.post("/api/bookings/1/cancel").status_code == 401


def test_booking_creation_validation():
    token = get_token_for("rahul.guest@airbnb.test")
    headers = {"Authorization": f"Bearer {token}"}
    today = date.today()

    # Past date
    res = client.post(
        "/api/bookings",
        json={
            "listing_id": 1,
            "check_in": (today - timedelta(days=5)).isoformat(),
            "check_out": (today - timedelta(days=2)).isoformat(),
            "adults": 1,
        },
        headers=headers,
    )
    assert res.status_code == 400
    assert "past" in res.json()["detail"].lower()

    # check_out <= check_in
    res = client.post(
        "/api/bookings",
        json={
            "listing_id": 1,
            "check_in": (today + timedelta(days=10)).isoformat(),
            "check_out": (today + timedelta(days=10)).isoformat(),
            "adults": 1,
        },
        headers=headers,
    )
    assert res.status_code == 400
    assert "strictly after" in res.json()["detail"].lower()

    # Over capacity
    res = client.post(
        "/api/bookings",
        json={
            "listing_id": 1,
            "check_in": (today + timedelta(days=10)).isoformat(),
            "check_out": (today + timedelta(days=12)).isoformat(),
            "adults": 20,
        },
        headers=headers,
    )
    assert res.status_code == 400
    assert "exceeds maximum capacity" in res.json()["detail"].lower()


def test_booking_flow_snapshots_and_availability():
    db = SessionLocal()
    try:
        listing = db.query(Listing).filter(Listing.id == 1).first()
        assert listing is not None
        host_id = listing.host_id
    finally:
        db.close()

    guest1_token = get_token_for("rahul.guest@airbnb.test")
    guest2_token = get_token_for("neha.guest@airbnb.test")
    h1 = {"Authorization": f"Bearer {guest1_token}"}
    h2 = {"Authorization": f"Bearer {guest2_token}"}

    # Pick future date range far ahead to avoid seed overlaps
    start_d = date.today() + timedelta(days=200)
    end_d = start_d + timedelta(days=3)

    created_booking_ids = []
    try:
        # 1. Create initial booking
        res1 = client.post(
            "/api/bookings",
            json={
                "listing_id": 1,
                "check_in": start_d.isoformat(),
                "check_out": end_d.isoformat(),
                "adults": 2,
            },
            headers=h1,
        )
        assert res1.status_code == 201
        b1 = res1.json()
        assert b1["confirmation_code"].startswith("HM")
        assert len(b1["confirmation_code"]) == 8
        assert b1["nights"] == 3
        assert b1["nightly_rate"] == listing.price_per_night
        assert b1["status"] == "confirmed"
        assert b1["listing"]["id"] == 1
        booking_id = b1["id"]
        created_booking_ids.append(booking_id)

        # 2. Overlap attempts (should all 409 with DATES_UNAVAILABLE)
        # Exact overlap
        res_exact = client.post(
            "/api/bookings",
            json={"listing_id": 1, "check_in": start_d.isoformat(), "check_out": end_d.isoformat(), "adults": 1},
            headers=h2,
        )
        assert res_exact.status_code == 409
        assert res_exact.headers.get("x-error-code") == "DATES_UNAVAILABLE"

        # Overlap start
        res_left = client.post(
            "/api/bookings",
            json={
                "listing_id": 1,
                "check_in": (start_d - timedelta(days=1)).isoformat(),
                "check_out": (start_d + timedelta(days=1)).isoformat(),
                "adults": 1,
            },
            headers=h2,
        )
        assert res_left.status_code == 409

        # 3. Adjacent bookings allowed (new.check_in == existing.check_out)
        res_adj = client.post(
            "/api/bookings",
            json={
                "listing_id": 1,
                "check_in": end_d.isoformat(),
                "check_out": (end_d + timedelta(days=2)).isoformat(),
                "adults": 1,
            },
            headers=h2,
        )
        assert res_adj.status_code == 201
        created_booking_ids.append(res_adj.json()["id"])

        # 4. Details access check
        detail_res = client.get(f"/api/bookings/{booking_id}", headers=h1)
        assert detail_res.status_code == 200
        assert detail_res.json()["confirmation_code"] == b1["confirmation_code"]

        # Other guest cannot view booking
        forbidden_res = client.get(f"/api/bookings/{booking_id}", headers=h2)
        assert forbidden_res.status_code == 403

        # Host of listing CAN view booking
        db = SessionLocal()
        host_user = db.query(User).filter(User.id == host_id).first()
        db.close()
        host_token = get_token_for(host_user.email)
        host_view_res = client.get(
            f"/api/bookings/{booking_id}",
            headers={"Authorization": f"Bearer {host_token}"},
        )
        assert host_view_res.status_code == 200

        # 5. Trips endpoint
        trips_res = client.get("/api/bookings/me", headers=h1)
        assert trips_res.status_code == 200
        upcoming_ids = [t["id"] for t in trips_res.json()["upcoming"]]
        assert booking_id in upcoming_ids

        # 6. Cancellation releases dates
        cancel_res = client.post(f"/api/bookings/{booking_id}/cancel", headers=h1)
        assert cancel_res.status_code == 200
        assert cancel_res.json()["status"] == "cancelled"

        # Date can now be booked by guest 2
        rebook_res = client.post(
            "/api/bookings",
            json={"listing_id": 1, "check_in": start_d.isoformat(), "check_out": end_d.isoformat(), "adults": 1},
            headers=h2,
        )
        assert rebook_res.status_code == 201
        created_booking_ids.append(rebook_res.json()["id"])
    finally:
        if created_booking_ids:
            cleanup_db = SessionLocal()
            cleanup_db.query(Booking).filter(Booking.id.in_(created_booking_ids)).delete(synchronize_session=False)
            cleanup_db.commit()
            cleanup_db.close()
