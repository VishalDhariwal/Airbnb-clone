from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, field_validator


class RoleOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SwitchRoleRequest(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        v = v.strip().lower()
        if v not in ("host", "traveller", "admin"):
            raise ValueError("Role must be one of: host, traveller, admin")
        return v


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email format")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email format")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Password is required")
        return v


class DemoLoginRequest(BaseModel):
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
    role: str = "traveller"
    roles: List[str] = []
    bio: Optional[str] = None
    response_rate: Optional[int] = None
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("roles", mode="before")
    @classmethod
    def extract_roles(cls, v):
        if not v:
            return ["traveller"]
        if isinstance(v, list):
            res = []
            for item in v:
                if isinstance(item, str):
                    res.append(item.lower())
                elif hasattr(item, "name"):
                    res.append(str(item.name).lower())
            if "traveller" not in res:
                res.append("traveller")
            return sorted(list(set(res)))
        return ["traveller"]


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
    role: str = "traveller"
    roles: List[str] = []
    role_badge: str  # "Superhost" | "Host" | "Guest"

    model_config = ConfigDict(from_attributes=True)

    @field_validator("roles", mode="before")
    @classmethod
    def extract_roles(cls, v):
        if not v:
            return ["traveller"]
        if isinstance(v, list):
            res = []
            for item in v:
                if isinstance(item, str):
                    res.append(item.lower())
                elif hasattr(item, "name"):
                    res.append(str(item.name).lower())
            if "traveller" not in res:
                res.append("traveller")
            return sorted(list(set(res)))
        return ["traveller"]
