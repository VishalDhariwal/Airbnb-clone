from fastapi import Depends
from fastapi.testclient import TestClient
from app.core.deps import get_current_host, get_current_user
from app.main import app
from app.models import User

client = TestClient(app)

# Temporary test route to verify host-only access check
@app.get("/api/test-host-guard")
def sample_host_route(host: User = Depends(get_current_host)):
    return {"message": f"Welcome host {host.name}"}


def test_login_existing_host():
    res = client.post("/api/auth/login", json={"email": "priya.host@airbnb.test"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "priya.host@airbnb.test"
    assert data["user"]["is_host"] is True
    assert data["user"]["is_superhost"] is True


def test_login_creates_new_guest_user():
    new_email = "newtraveler@example.com"
    res = client.post("/api/auth/login", json={"email": new_email})
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["email"] == new_email
    assert data["user"]["is_host"] is False


def test_auth_me_protected():
    # 1. Without token -> 401
    res = client.get("/api/auth/me")
    assert res.status_code == 401

    # 2. With invalid token -> 401
    res = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.token.value"})
    assert res.status_code == 401

    # 3. With valid token -> 200
    login_res = client.post("/api/auth/login", json={"email": "rahul.guest@airbnb.test"})
    token = login_res.json()["access_token"]
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "rahul.guest@airbnb.test"


def test_host_guard_allows_host_and_blocks_guest():
    # Login as host -> allowed (200)
    host_login = client.post("/api/auth/login", json={"email": "priya.host@airbnb.test"})
    host_token = host_login.json()["access_token"]
    host_res = client.get(
        "/api/test-host-guard", headers={"Authorization": f"Bearer {host_token}"}
    )
    assert host_res.status_code == 200
    assert "Welcome host" in host_res.json()["message"]

    # Login as guest -> forbidden (403)
    guest_login = client.post("/api/auth/login", json={"email": "rahul.guest@airbnb.test"})
    guest_token = guest_login.json()["access_token"]
    guest_res = client.get(
        "/api/test-host-guard", headers={"Authorization": f"Bearer {guest_token}"}
    )
    assert guest_res.status_code == 403
    assert "Host privileges required" in guest_res.json()["detail"]


def test_get_demo_users():
    res = client.get("/api/auth/demo-users")
    assert res.status_code == 200
    users = res.json()
    assert len(users) == 10
    badges = {u["role_badge"] for u in users}
    assert "Superhost" in badges
    assert "Host" in badges
    assert "Guest" in badges


def test_wishlist_crud_flow():
    # Guest user login
    login_res = client.post("/api/auth/login", json={"email": "neha.guest@airbnb.test"})
    token = login_res.json()["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}

    # 1. Unauthenticated request to wishlist fails
    unauth_res = client.post("/api/wishlist/1")
    assert unauth_res.status_code == 401

    # 2. Add listing 1 to wishlist
    add_res = client.post("/api/wishlist/1", headers=auth_header)
    assert add_res.status_code == 200
    assert add_res.json()["saved"] is True

    # 3. Check wishlist IDs contains 1
    ids_res = client.get("/api/wishlist/ids", headers=auth_header)
    assert ids_res.status_code == 200
    assert 1 in ids_res.json()

    # 4. Check full wishlist cards returns listing 1
    cards_res = client.get("/api/wishlist", headers=auth_header)
    assert cards_res.status_code == 200
    saved_ids = [c["id"] for c in cards_res.json()]
    assert 1 in saved_ids

    # 5. Remove listing 1 from wishlist
    del_res = client.delete("/api/wishlist/1", headers=auth_header)
    assert del_res.status_code == 200
    assert del_res.json()["saved"] is False

    # 6. Verify removed from IDs
    ids_res_after = client.get("/api/wishlist/ids", headers=auth_header)
    assert 1 not in ids_res_after.json()
