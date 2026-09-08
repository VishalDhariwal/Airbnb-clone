from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.database import get_db
from app.models import Role, User
from app.schemas.auth import (
    DemoLoginRequest,
    DemoUserOut,
    LoginRequest,
    RoleOut,
    SignupRequest,
    SwitchRoleRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """
    Registers a new user account with secure bcrypt password hashing and default traveller role.
    """
    email_clean = payload.email.strip().lower()
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    # Resolve or create traveller role in DB
    traveller_role = db.query(Role).filter(Role.name == "traveller").first()
    if not traveller_role:
        traveller_role = Role(
            name="traveller",
            description="Explore, search, and book stays and experiences",
        )
        db.add(traveller_role)
        db.flush()

    hashed = get_password_hash(payload.password)
    user = User(
        name=payload.name.strip(),
        email=email_clean,
        hashed_password=hashed,
        is_host=False,
        is_superhost=False,
        role="traveller",
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    )
    user.roles.append(traveller_role)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates an existing user via email and password using bcrypt verification.
    """
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    valid = False
    if user and user.hashed_password:
        valid = verify_password(payload.password, user.hashed_password)
    elif user and not user.hashed_password:
        # Graceful migration for existing legacy records
        if payload.password == "password123":
            user.hashed_password = get_password_hash("password123")
            db.commit()
            valid = True

    if not user or not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/demo-login", response_model=TokenResponse)
def demo_login(payload: DemoLoginRequest, db: Session = Depends(get_db)):
    """
    Provides fast 1-click persona switching for pre-seeded demo accounts.
    """
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demo user not found",
        )

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


@router.post("/roles/switch", response_model=UserOut)
def switch_active_role(
    payload: SwitchRoleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Switches the active persona (traveller / host) if the user has been granted that role.
    """
    requested_role = payload.role.strip().lower()
    
    # Check if user has permission for this role
    if not current_user.has_role(requested_role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You do not possess the '{requested_role}' role. Please complete onboarding first.",
        )
    
    current_user.role = requested_role
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)


@router.get("/roles", response_model=List[RoleOut])
def get_all_roles(db: Session = Depends(get_db)):
    """
    Returns all defined system roles and descriptions.
    """
    roles = db.query(Role).order_by(Role.id.asc()).all()
    return [RoleOut.model_validate(r) for r in roles]


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
                role=u.role,
                roles=u.role_names,
                role_badge=badge,
            )
        )
    return results
