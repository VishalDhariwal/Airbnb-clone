from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator


class LoginRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email format")
        return v


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    is_host: bool
    is_superhost: bool
    bio: Optional[str] = None
    response_rate: Optional[int] = None
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class DemoUserOut(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    is_host: bool
    is_superhost: bool
    role_badge: str  # "Superhost" | "Host" | "Guest"

    model_config = ConfigDict(from_attributes=True)
