from datetime import date
from sqlalchemy import (
    Date,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class BlockedDate(Base):
    __tablename__ = "blocked_dates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    listing_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False
    )
    date: Mapped[date] = mapped_column(Date, nullable=False)

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="blocked_dates")

    __table_args__ = (
        UniqueConstraint("listing_id", "date", name="uq_blocked_listing_date"),
    )
