from datetime import date, datetime
from typing import List
from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    confirmation_code: Mapped[str] = mapped_column(
        String(32), unique=True, index=True, nullable=False
    )
    listing_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("listings.id"), nullable=False
    )
    guest_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    check_in: Mapped[date] = mapped_column(Date, nullable=False)
    check_out: Mapped[date] = mapped_column(Date, nullable=False)
    adults: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    children: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    infants: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    pets: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    nights: Mapped[int] = mapped_column(Integer, nullable=False)

    # Price snapshots (immutable copies captured at booking time)
    nightly_rate: Mapped[int] = mapped_column(Integer, nullable=False)
    cleaning_fee: Mapped[int] = mapped_column(Integer, nullable=False)
    service_fee: Mapped[int] = mapped_column(Integer, nullable=False)
    taxes: Mapped[int] = mapped_column(Integer, nullable=False)
    total_price: Mapped[int] = mapped_column(Integer, nullable=False)

    status: Mapped[str] = mapped_column(
        String(20), default="confirmed", nullable=False
    )  # confirmed, cancelled, completed
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="bookings")
    guest: Mapped["User"] = relationship("User", back_populates="bookings")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="booking")

    __table_args__ = (
        Index("idx_bookings_listing_dates", "listing_id", "check_in", "check_out"),
    )
