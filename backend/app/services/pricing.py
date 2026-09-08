from datetime import date
from typing import Dict


def calculate_price_breakdown(
    nightly_rate: int,
    cleaning_fee: int,
    check_in: date,
    check_out: date,
) -> Dict[str, int]:
    """
    Computes canonical pricing breakdown for a stay (§1.4).
    All currency values are integers (INR).
    
    Formula:
      nights          = (check_out - check_in).days
      subtotal        = nightly_rate * nights
      cleaning_fee    = listing.cleaning_fee
      service_fee     = round(subtotal * 0.14)     # Airbnb guest service fee ~14%
      taxes           = round((subtotal + cleaning_fee) * 0.05) # 5% tax
      total           = subtotal + cleaning_fee + service_fee + taxes
    """
    nights = (check_out - check_in).days
    if nights <= 0:
        raise ValueError("check_out date must be strictly after check_in date")

    subtotal = nightly_rate * nights
    service_fee = round(subtotal * 0.14)
    taxes = round((subtotal + cleaning_fee) * 0.05)
    total_price = subtotal + cleaning_fee + service_fee + taxes

    return {
        "nightly_rate": nightly_rate,
        "nights": nights,
        "subtotal": subtotal,
        "cleaning_fee": cleaning_fee,
        "service_fee": service_fee,
        "taxes": taxes,
        "total_price": total_price,
    }
