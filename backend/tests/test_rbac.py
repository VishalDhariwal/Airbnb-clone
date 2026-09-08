import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker

from app.database import engine
from app.main import app
from app.models import Role, User

client = TestClient(app)
Session = sessionmaker(bind=engine)


def test_database_roles_seeded():
    """Verify that roles are populated in PostgreSQL."""
    db = Session()
    try:
        roles = db.query(Role).all()
        role_names = {r.name for r in roles}
        assert "traveller" in role_names
        assert "host" in role_names
        assert "admin" in role_names
    finally:
        db.close()


def test_get_all_roles_endpoint():
    """GET /api/auth/roles returns the catalog of defined roles."""
    res = client.get("/api/auth/roles")
    assert res.status_code == 200
    roles = res.json()
    assert len(roles) >= 3
    names = [r["name"] for r in roles]
    assert "traveller" in names
    assert "host" in names


def test_signup_assigns_traveller_role_in_db():
    """Signing up creates a user with default traveller role in user_roles table."""
    email = "rbac_new_traveler@example.com"
    db = Session()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            db.delete(existing)
            db.commit()
    finally:
        db.close()

    res = client.post(
        "/api/auth/signup",
        json={"name": "RBAC Traveler", "email": email, "password": "password123"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["user"]["role"] == "traveller"
    assert "traveller" in data["user"]["roles"]

    # Verify DB directly
    db = Session()
    try:
        user = db.query(User).filter(User.email == email).first()
        assert user is not None
        assert user.has_role("traveller") is True
        assert user.has_role("host") is False
        assert "traveller" in user.role_names
    finally:
        db.close()


def test_role_switch_forbidden_before_onboarding():
    """A pure traveller cannot switch active role to host before onboarding."""
    # Login as pure traveller
    login_res = client.post(
        "/api/auth/demo-login",
        json={"email": "rahul.guest@airbnb.test"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt to switch to host
    switch_res = client.post(
        "/api/auth/roles/switch",
        headers=headers,
        json={"role": "host"},
    )
    # rahul.guest is a traveller, so switching to host without onboarding must be 403 Forbidden
    assert switch_res.status_code == 403
    assert "You do not possess the 'host' role" in switch_res.json()["detail"]


def test_host_can_switch_roles_freely():
    """A host account can switch active role between traveller and host."""
    login_res = client.post(
        "/api/auth/demo-login",
        json={"email": "priya.host@airbnb.test"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Switch to traveller
    switch_traveller = client.post(
        "/api/auth/roles/switch",
        headers=headers,
        json={"role": "traveller"},
    )
    assert switch_traveller.status_code == 200
    assert switch_traveller.json()["role"] == "traveller"

    # Switch back to host
    switch_host = client.post(
        "/api/auth/roles/switch",
        headers=headers,
        json={"role": "host"},
    )
    assert switch_host.status_code == 200
    assert switch_host.json()["role"] == "host"


def test_traveller_onboard_grants_host_role_and_enables_switching():
    """When a traveller onboards as host, they get host role in user_roles and can switch."""
    email = "rbac_onboard_test@example.com"
    db = Session()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            db.delete(existing)
            db.commit()
    finally:
        db.close()

    signup_res = client.post(
        "/api/auth/signup",
        json={"name": "Future Host", "email": email, "password": "password123"},
    )
    assert signup_res.status_code == 201
    token = signup_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Onboard as host
    onboard_res = client.post("/api/host/onboard", headers=headers)
    assert onboard_res.status_code == 200
    user_data = onboard_res.json()
    assert user_data["is_host"] is True
    assert user_data["role"] == "host"
    assert "host" in user_data["roles"]

    # Check host-protected route
    listings_res = client.get("/api/host/listings", headers=headers)
    assert listings_res.status_code == 200

    # Switch to traveller
    switch_traveller = client.post(
        "/api/auth/roles/switch",
        headers=headers,
        json={"role": "traveller"},
    )
    assert switch_traveller.status_code == 200
    assert switch_traveller.json()["role"] == "traveller"
