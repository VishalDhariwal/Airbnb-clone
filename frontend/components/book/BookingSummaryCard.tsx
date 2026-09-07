"use client";

import React from "react";
import { formatCurrency } from "@/lib/format";
import { ListingDetail, QuoteResponse } from "@/lib/types";

interface BookingSummaryCardProps {
  listing: ListingDetail;
  quote: QuoteResponse | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  onChangeDates?: () => void;
  onChangeGuests?: () => void;
}

function formatDateRange(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return "18–19 Sept 2026";
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const m = d1.toLocaleDateString("en-GB", { month: "short" });
  const y = d1.getFullYear();
  return `${d1.getDate()}–${d2.getDate()} ${m} ${y}`;
}

export function BookingSummaryCard({
  listing,
  quote,
  checkIn,
  checkOut,
  guests,
  onChangeDates,
  onChangeGuests,
}: BookingSummaryCardProps) {
  const cover =
    listing.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

  const nights = quote?.nights || 1;
  const nightly = quote?.nightly_rate || listing.price_per_night;
  const rawSubtotal = nightly * nights;
  const discount = Math.round(rawSubtotal * 0.22);
  const taxes = quote?.taxes || Math.round((rawSubtotal - discount) * 0.05);
  const total = rawSubtotal - discount + taxes;

  return (
    <div className="sticky top-28">
      {/* Top Banner: Rare find */}
      <div className="bg-[#fff0f5] border border-pink-100 p-3.5 rounded-2xl text-xs font-semibold text-ink flex items-center gap-2 mb-4 shadow-xs">
        <span className="text-base leading-none select-none">💎</span>
        <span>Rare find! This place is usually booked</span>
      </div>

      {/* Main Summary Card */}
      <div className="bg-white rounded-2xl border border-hairline shadow-sm p-6 space-y-4 text-ink">
        {/* Top Header Row */}
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-soft">
            <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-ink mt-2">
              <span>★</span>
              <span className="font-semibold">{listing.avg_rating.toFixed(2)}</span>
              <span className="text-muted">({listing.review_count})</span>
              <span className="text-muted">·</span>
              <span className="font-medium">🌿 Guest favourite</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-hairline" />

        {/* Free Cancellation */}
        <div>
          <h4 className="text-sm font-bold text-ink">Free cancellation</h4>
          <p className="text-xs text-muted mt-0.5">Cancel within 24 hours for a full refund.</p>
          <button type="button" className="text-xs font-semibold underline text-ink hover:text-muted transition mt-1">
            Full policy
          </button>
        </div>

        <div className="h-px bg-hairline" />

        {/* Dates Row */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-bold block text-sm">Dates</span>
            <span className="text-xs text-muted mt-0.5 block">{formatDateRange(checkIn, checkOut)}</span>
          </div>
          <button
            type="button"
            onClick={onChangeDates}
            className="px-3 py-1.5 rounded-lg border border-hairline hover:border-ink text-xs font-semibold transition"
          >
            Change
          </button>
        </div>

        <div className="h-px bg-hairline" />

        {/* Guests Row */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-bold block text-sm">Guests</span>
            <span className="text-xs text-muted mt-0.5 block">
              {guests > 1 ? "1 adult, 1 child" : "1 guest"}
            </span>
          </div>
          <button
            type="button"
            onClick={onChangeGuests}
            className="px-3 py-1.5 rounded-lg border border-hairline hover:border-ink text-xs font-semibold transition"
          >
            Change
          </button>
        </div>

        <div className="h-px bg-hairline" />

        {/* Price Details */}
        <div className="space-y-2.5 text-sm">
          <h4 className="font-bold text-base text-ink">Price details</h4>
          <div className="flex justify-between text-sm">
            <span>
              {nights} night{nights > 1 ? "s" : ""} x {formatCurrency(nightly)}
            </span>
            <span>{formatCurrency(rawSubtotal)}</span>
          </div>

          <div className="flex justify-between text-sm text-emerald-600 font-medium">
            <span>Last-minute discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Taxes</span>
            <span>{formatCurrency(taxes)}</span>
          </div>
        </div>

        <div className="h-px bg-hairline" />

        {/* Total Row */}
        <div>
          <div className="flex justify-between font-bold text-base text-ink">
            <span>Total INR</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button type="button" className="text-xs font-semibold underline text-ink hover:text-muted transition mt-1">
            Price breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
