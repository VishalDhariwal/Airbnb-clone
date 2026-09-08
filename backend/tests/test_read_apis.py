from datetime import date, timedelta
import pytest
from fastapi.testclient import TestClient
from app.database import SessionLocal
from app.main import app
from app.models import Booking, Listing

client = TestClient(app)


def test_get_listings_default_pagination():
    response = client.get("/api/listings")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) == 18
    assert data["total"] >= 68
    assert data["page"] == 1
    assert data["has_more"] is True


def test_location_search_filter():
    response = client.get("/api/listings?location=goa")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for item in data["items"]:
        assert item["city"].lower() == "goa"


def test_price_range_filter():
    min_p, max_p = 5000, 10000
    response = client.get(f"/api/listings?min_price={min_p}&max_price={max_p}")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for item in data["items"]:
        assert min_p <= item["price_per_night"] <= max_p


def test_category_and_amenity_filter():
    # Category filter
    response = client.get("/api/listings?category=beachfront")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0

    # Amenity filter
    amen_res = client.get("/api/amenities")
    first_amen_id = amen_res.json()[0]["id"]
    filtered_res = client.get(f"/api/listings?amenities={first_amen_id}")
    assert filtered_res.status_code == 200
    assert len(filtered_res.json()["items"]) > 0


def test_date_availability_overlap_and_adjacent_allowed():
    """
    Validates that a confirmed booking excludes a listing during its booked range,
    but allows adjacent stays where new check_in == existing check_out (§1.5).
    """
    db = SessionLocal()
    try:
        # Find a confirmed future booking
        booking = (
            db.query(Booking)
            .filter(Booking.status == "confirmed", Booking.check_in > date.today())
            .first()
        )
        assert booking is not None, "Seed data missing confirmed future booking"
        booked_listing_id = booking.listing_id
        cin = booking.check_in
        cout = booking.check_out

        # 1. Overlapping search: listing must be excluded
        overlap_res = client.get(
            f"/api/listings?check_in={cin.isoformat()}&check_out={cout.isoformat()}&limit=100"
        )
        assert overlap_res.status_code == 200
        overlap_ids = [item["id"] for item in overlap_res.json()["items"]]
        assert booked_listing_id not in overlap_ids, "Booked listing should not appear in overlapping search"

        # 2. Adjacent stay: new check_in is exactly existing check_out
        adj_in = cout
        adj_out = cout + timedelta(days=2)
        adj_res = client.get(
            f"/api/listings?check_in={adj_in.isoformat()}&check_out={adj_out.isoformat()}&limit=100"
        )
        assert adj_res.status_code == 200
        adj_ids = [item["id"] for item in adj_res.json()["items"]]
        assert booked_listing_id in adj_ids, "Booked listing must be available starting on its check-out date"

    finally:
        db.close()


def test_home_sections():
    response = client.get("/api/listings/home-sections")
    assert response.status_code == 200
    sections = response.json()
    assert len(sections) == 5
    assert sections[0]["id"] == "newly-published"
    for sec in sections:
        assert "id" in sec
        assert "title" in sec
        assert len(sec["items"]) > 0


def test_listing_detail_graph():
    response = client.get("/api/listings/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "photos" in data and len(data["photos"]) >= 5
    assert "amenities_grouped" in data
    assert "host" in data
    assert data["host"]["name"] is not None
    assert "categories" in data


def test_quote_endpoint_pricing():
    today = date.today()
    cin = today + timedelta(days=30)
    cout = today + timedelta(days=33)  # 3 nights

    res = client.post(
        "/api/listings/1/quote",
        json={"check_in": cin.isoformat(), "check_out": cout.isoformat(), "guests": 2},
    )
    assert res.status_code == 200
    quote = res.json()
    assert quote["nights"] == 3
    expected_subtotal = quote["nightly_rate"] * 3
    assert quote["subtotal"] == expected_subtotal
    expected_service_fee = round(expected_subtotal * 0.14)
    assert quote["service_fee"] == expected_service_fee
    expected_taxes = round((expected_subtotal + quote["cleaning_fee"]) * 0.05)
    assert quote["taxes"] == expected_taxes
    expected_total = expected_subtotal + quote["cleaning_fee"] + expected_service_fee + expected_taxes
    assert quote["total_price"] == expected_total
    assert quote["available"] is True


def test_availability_and_reviews_endpoints():
    # Availability
    avail_res = client.get("/api/listings/1/availability")
    assert avail_res.status_code == 200
    avail_data = avail_res.json()
    assert "unavailable_dates" in avail_data
    assert isinstance(avail_data["unavailable_dates"], list)

    # Reviews
    rev_res = client.get("/api/listings/1/reviews")
    assert rev_res.status_code == 200
    rev_data = rev_res.json()
    assert "items" in rev_data
    assert "sub_rating_averages" in rev_data
    assert "cleanliness" in rev_data["sub_rating_averages"]
