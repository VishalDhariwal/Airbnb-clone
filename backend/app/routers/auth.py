from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.core.security import create_access_token
from app.database import get_db
from app.models import User
from app.schemas.auth import DemoUserOut, LoginRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Mocked passwordless authentication issuing standard signed JWT tokens (§1.3).
    Finds existing user or provisions a new guest user.
    """
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        name_prefix = email_clean.split("@")[0].replace(".", " ").title()
        user = User(
            name=name_prefix,
            email=email_clean,
            is_host=False,
            is_superhost=False,
            avatar_url=f"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user profile from token context."""
    return UserOut.model_validate(current_user)


@router.get("/demo-users", response_model=List[DemoUserOut])
def get_demo_users(db: Session = Depends(get_db)):
    """
    Returns seeded users for the 1-click persona switcher, labelled Superhost, Host, or Guest.
    """
    users = db.query(User).order_by(User.id.asc()).limit(10).all()
    results = []
    for u in users:
        badge = "Superhost" if u.is_superhost else ("Host" if u.is_host else "Guest")
        results.append(
            DemoUserOut(
                id=u.id,
                name=u.name,
                email=u.email,
                avatar_url=u.avatar_url,
                is_host=u.is_host,
                is_superhost=u.is_superhost,
                role_badge=badge,
            )
        )
    return results
