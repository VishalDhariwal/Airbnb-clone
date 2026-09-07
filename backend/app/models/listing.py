from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.amenity import listing_amenities
from app.models.category import listing_categories


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    host_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    property_type: Mapped[str] = mapped_column(String(50), nullable=False)  # house/flat/villa/room/hotel/bungalow
    room_type: Mapped[str] = mapped_column(String(50), nullable=False)      # entire/private/shared
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False, default="India")
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    price_per_night: Mapped[int] = mapped_column(Integer, nullable=False)  # Integer INR (never float)
    cleaning_fee: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_guests: Mapped[int] = mapped_column(Integer, nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False)
    beds: Mapped[int] = mapped_column(Integer, nullable=False)
    bathrooms: Mapped[float] = mapped_column(Float, nullable=False)
    is_guest_favorite: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Denormalised rating stats, updated on new review creation
    avg_rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    host: Mapped["User"] = relationship("User", back_populates="listings")
    photos: Mapped[List["ListingPhoto"]] = relationship(
        "ListingPhoto",
        back_populates="listing",
        cascade="all, delete-orphan",
        order_by="ListingPhoto.position",
    )
    amenities: Mapped[List["Amenity"]] = relationship(
        "Amenity", secondary=listing_amenities, back_populates="listings"
    )
    categories: Mapped[List["Category"]] = relationship(
        "Category", secondary=listing_categories, back_populates="listings"
    )
    # Important: Do NOT cascade delete bookings when deleting a listing; bookings are legal records.
    bookings: Mapped[List["Booking"]] = relationship(
        "Booking", back_populates="listing"
    )
    reviews: Mapped[List["Review"]] = relationship(
        "Review", back_populates="listing", cascade="all, delete-orphan"
    )
    blocked_dates: Mapped[List["BlockedDate"]] = relationship(
        "BlockedDate", back_populates="listing", cascade="all, delete-orphan"
    )
    wishlist_items: Mapped[List["WishlistItem"]] = relationship(
        "WishlistItem", back_populates="listing", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_listings_city", "city"),
        Index("idx_listings_price", "price_per_night"),
        Index("idx_listings_host", "host_id"),
    )
