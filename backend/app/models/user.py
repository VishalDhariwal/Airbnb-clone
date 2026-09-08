from datetime import datetime
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_host: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_superhost: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="traveller", nullable=False)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    joined_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    response_rate: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # e.g., 98
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    roles: Mapped[List["Role"]] = relationship(
        "Role", secondary="user_roles", back_populates="users", lazy="joined"
    )
    listings: Mapped[List["Listing"]] = relationship(
        "Listing", back_populates="host", cascade="all, delete-orphan"
    )
    bookings: Mapped[List["Booking"]] = relationship(
        "Booking", back_populates="guest"
    )
    reviews: Mapped[List["Review"]] = relationship(
        "Review", back_populates="author"
    )
    wishlist_items: Mapped[List["WishlistItem"]] = relationship(
        "WishlistItem", back_populates="user", cascade="all, delete-orphan"
    )

    @property
    def role_names(self) -> List[str]:
        """Returns all distinct role names assigned to this user."""
        names = {r.name.lower() for r in self.roles} if self.roles else set()
        if self.is_host:
            names.add("host")
        elif "host" in names and not self.is_host:
            names.remove("host")
        if not names:
            names.add("traveller")
        if "traveller" not in names:
            names.add("traveller")
        return sorted(list(names))

    def has_role(self, role_name: str) -> bool:
        """Checks if user has the specified role."""
        target = role_name.lower().strip()
        if target == "traveller":
            return True  # All users have base traveller access
        if target == "host":
            return bool(self.is_host)
        # For other roles (e.g. admin)
        if self.role and self.role.lower().strip() == target:
            return True
        if self.roles and any(r.name.lower().strip() == target for r in self.roles):
            return True
        return False

