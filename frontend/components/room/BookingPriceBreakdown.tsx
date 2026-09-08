"use client";

import React from "react";
import { formatCurrency } from "@/lib/format";
import { QuoteResponse } from "@/lib/types";

interface BookingPriceBreakdownProps {
  quote: QuoteResponse;
}

export function BookingPriceBreakdown({ quote }: BookingPriceBreakdownProps) {
  if (!quote.available) return null;

  return (
    <div className="mt-5 pt-4 border-t border-hairline-soft space-y-3 text-sm text-bodytext">
      <div className="flex justify-between">
        <span className="underline">
          {formatCurrency(quote.nightly_rate)} x {quote.nights} nights
        </span>
        <span>{formatCurrency(quote.subtotal)}</span>
      </div>

      <div className="flex justify-between">
        <span className="underline">Cleaning fee</span>
        <span>{formatCurrency(quote.cleaning_fee)}</span>
      </div>

      <div className="flex justify-between">
        <span className="underline">Airbnb service fee (14%)</span>
        <span>{formatCurrency(quote.service_fee)}</span>
      </div>

      <div className="flex justify-between">
        <span className="underline">Taxes (5%)</span>
        <span>{formatCurrency(quote.taxes)}</span>
      </div>

      <div className="pt-3 border-t border-hairline-soft flex justify-between font-bold text-base text-ink">
        <span>Total before taxes</span>
        <span>{formatCurrency(quote.total_price)}</span>
      </div>
    </div>
  );
}
