from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.database import get_db
from app.models import User

# HTTPBearer extracts 'Authorization: Bearer <token>' header
security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Authenticates the user from the Bearer token.
    Raises 401 Unauthorized if missing, malformed, or user not found.
    """
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(auth.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_email = payload["sub"]
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def require_role(role_name: str):
    """
    Dependency factory to enforce that the authenticated user possesses the specified role.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if not current_user.has_role(role_name):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"{role_name.capitalize()} privileges required for this action",
            )
        return current_user

    return role_checker


def require_any_role(*role_names: str):
    """
    Dependency factory to ensure user has at least one of the provided roles.
    """
    def any_role_checker(current_user: User = Depends(get_current_user)) -> User:
        if not any(current_user.has_role(r) for r in role_names):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"One of the following privileges required: {', '.join(role_names)}",
            )
        return current_user

    return any_role_checker


def require_host(current_user: User = Depends(get_current_user)) -> User:
    """
    Ensures the authenticated user has host privileges via RBAC or is_host.
    """
    if not current_user.has_role("host"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Host privileges required for this action",
        )
    return current_user


# Backward compatibility alias
get_current_host = require_host


def require_traveller(current_user: User = Depends(get_current_user)) -> User:
    """
    Ensures the authenticated user has traveller privileges.
    """
    if not current_user.has_role("traveller"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Traveller privileges required for this action",
        )
    return current_user


def get_optional_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Resolves current user if token is provided, returns None otherwise."""
    if not auth or not auth.credentials:
        return None

    payload = decode_access_token(auth.credentials)
    if not payload or "sub" not in payload:
        return None

    return db.query(User).filter(User.email == payload["sub"]).first()
