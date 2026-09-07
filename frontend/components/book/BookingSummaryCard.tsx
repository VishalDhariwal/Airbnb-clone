"use client";

import React from "react";
import { formatCurrency } from "@/lib/format";
import { ListingDetail, QuoteResponse } from "@/lib/types";
import { StarIcon } from "@/components/ui/Icons";

interface BookingSummaryCardProps {
  listing: ListingDetail;
  quote: QuoteResponse | null;
}

export function BookingSummaryCard({ listing, quote }: BookingSummaryCardProps) {
  const cover = listing.photos?.[0]?.url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

  return (
    <div className="sticky top-28 bg-white rounded-2xl border border-hairline shadow-sm p-6 space-y-6">
      {/* Property Overview */}
      <div className="flex gap-4 pb-6 border-b border-hairline-soft">
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-soft">
          <img
            src={cover}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted truncate">
            {listing.room_type} · {listing.property_type}
          </p>
          <h3 className="text-sm font-bold text-ink truncate mt-0.5">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-xs font-semibold text-ink mt-2">
            <StarIcon className="w-3.5 h-3.5 text-ink" />
            <span>{listing.avg_rating.toFixed(2)}</span>
            <span className="text-muted">({listing.review_count} reviews)</span>
            {listing.host.is_superhost && (
              <span className="text-[10px] bg-red-50 text-rausch px-1.5 py-0.5 rounded font-semibold ml-1">
                Superhost
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AirCover Badge */}
      <div className="text-xs text-bodytext bg-surface-soft p-3 rounded-xl flex items-center gap-2">
        <span className="text-rausch font-bold text-sm">air</span>
        <span className="font-bold text-ink text-sm">cover</span>
        <span className="text-muted ml-auto">Your booking is protected</span>
      </div>

      {/* Price Breakdown */}
      <div>
        <h4 className="text-base font-bold text-ink mb-4">Price details</h4>
        {quote ? (
          <div className="space-y-3 text-sm text-bodytext">
            <div className="flex justify-between">
              <span>
                {formatCurrency(quote.nightly_rate)} x {quote.nights} nights
              </span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>{formatCurrency(quote.cleaning_fee)}</span>
            </div>

            <div className="flex justify-between">
              <span>Airbnb service fee (14%)</span>
              <span>{formatCurrency(quote.service_fee)}</span>
            </div>

            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span>{formatCurrency(quote.taxes)}</span>
            </div>

            <div className="pt-4 border-t border-hairline-soft flex justify-between font-bold text-base text-ink">
              <span>Total (INR)</span>
              <span>{formatCurrency(quote.total_price)}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-surface-strong rounded w-3/4" />
            <div className="h-4 bg-surface-strong rounded w-1/2" />
            <div className="h-6 bg-surface-strong rounded w-full pt-2" />
          </div>
        )}
      </div>
    </div>
  );
}
