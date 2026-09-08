from datetime import date, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.models import BlockedDate, Booking


def check_range_availability(
    db: Session,
    listing_id: int,
    check_in: date,
    check_out: date,
) -> bool:
    """
    Checks whether a listing is available for the given date range (§1.5).
    Overlap condition:
      existing.check_in < new.check_out AND existing.check_out > new.check_in
    Strict inequalities allow adjacent bookings (same-day checkout / check-in).
    """
    if check_out <= check_in:
        return False

    # 1. Overlapping confirmed bookings
    overlapping_booking = (
        db.query(Booking.id)
        .filter(
            Booking.listing_id == listing_id,
            Booking.status == "confirmed",
            Booking.check_in < check_out,
            Booking.check_out > check_in,
        )
        .first()
    )
    if overlapping_booking:
        return False

    # 2. Host-blocked dates within [check_in, check_out)
    blocked_day = (
        db.query(BlockedDate.id)
        .filter(
            BlockedDate.listing_id == listing_id,
            BlockedDate.date >= check_in,
            BlockedDate.date < check_out,
        )
        .first()
    )
    if blocked_day:
        return False

    return True


def get_unavailable_dates(
    db: Session,
    listing_id: int,
    start_date: date,
    end_date: date,
) -> List[str]:
    """
    Returns a sorted list of ISO format dates (YYYY-MM-DD) that are unavailable
    for check-in between start_date and end_date.
    """
    unavailable = set()

    # Confirmed bookings in range
    bookings = (
        db.query(Booking.check_in, Booking.check_out)
        .filter(
            Booking.listing_id == listing_id,
            Booking.status == "confirmed",
            Booking.check_in < end_date,
            Booking.check_out > start_date,
        )
        .all()
    )

    for b_in, b_out in bookings:
        cur = max(b_in, start_date)
        last = min(b_out, end_date)
        while cur < last:
            unavailable.add(cur.isoformat())
            cur += timedelta(days=1)

    # Host-set blocked dates
    blocks = (
        db.query(BlockedDate.date)
        .filter(
            BlockedDate.listing_id == listing_id,
            BlockedDate.date >= start_date,
            BlockedDate.date <= end_date,
        )
        .all()
    )

    for (b_date,) in blocks:
        unavailable.add(b_date.isoformat())

    return sorted(list(unavailable))
