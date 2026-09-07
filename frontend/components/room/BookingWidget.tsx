"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { QuoteResponse } from "@/lib/types";
import { StarIcon } from "@/components/ui/Icons";

interface BookingWidgetProps {
  listingId: number;
  nightlyRate: number;
  cleaningFee: number;
  maxGuests: number;
  avgRating: number;
  reviewCount: number;
}

export function BookingWidget({
  listingId,
  nightlyRate,
  cleaningFee,
  maxGuests,
  avgRating,
  reviewCount,
}: BookingWidgetProps) {
  const router = useRouter();

  // Initial default stay: 3 to 6 days from today
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  });
  const [guests, setGuests] = useState(1);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setQuote(null);
      return;
    }

    let isMounted = true;
    setLoadingQuote(true);
    setQuoteError(null);

    api
      .post<QuoteResponse>(`/listings/${listingId}/quote`, {
        check_in: checkIn,
        check_out: checkOut,
        guests,
      })
      .then((data) => {
        if (isMounted) setQuote(data);
      })
      .catch((err) => {
        if (isMounted) {
          setQuote(null);
          setQuoteError(err?.message || "Selected dates unavailable");
        }
      })
      .finally(() => {
        if (isMounted) setLoadingQuote(false);
      });

    return () => {
      isMounted = false;
    };
  }, [listingId, checkIn, checkOut, guests]);

  function handleReserve() {
    if (!checkIn || !checkOut) return;
    router.push(
      `/book/${listingId}?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`
    );
  }

  const isAvailable = quote ? quote.available : true;

  return (
    <div className="sticky top-28 bg-white rounded-2xl border border-hairline shadow-[0_6px_20px_rgba(0,0,0,0.12)] p-6 z-10">
      {/* Price & Rating Header */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <span className="text-2xl font-bold text-ink">
            {formatCurrency(nightlyRate)}
          </span>
          <span className="text-muted text-sm font-normal"> night</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-ink">
          <StarIcon className="w-3.5 h-3.5 text-ink" />
          <span>{avgRating > 0 ? avgRating.toFixed(2) : "New"}</span>
          <span className="text-muted">·</span>
          <span className="text-muted underline">{reviewCount} reviews</span>
        </div>
      </div>

      {/* Date & Guest Selectors Box */}
      <div className="border border-hairline rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 border-b border-hairline divide-x divide-hairline">
          <div className="p-2.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">
              CHECK-IN
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-xs font-medium text-ink bg-transparent outline-none cursor-pointer"
            />
          </div>
          <div className="p-2.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">
              CHECKOUT
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-xs font-medium text-ink bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="p-2.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">
            GUESTS
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full text-xs font-medium text-ink bg-transparent outline-none cursor-pointer"
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reserve Button */}
      <button
        type="button"
        onClick={handleReserve}
        disabled={loadingQuote || !isAvailable}
        className="w-full py-3.5 bg-gradient-to-r from-rausch to-rausch-active text-white rounded-xl font-semibold text-sm hover:opacity-95 disabled:opacity-50 transition shadow-sm"
      >
        {loadingQuote
          ? "Checking dates..."
          : !isAvailable
          ? "Dates unavailable"
          : "Reserve"}
      </button>

      <p className="text-center text-xs text-muted mt-3">You won&apos;t be charged yet</p>

      {quoteError && (
        <p className="text-center text-xs text-danger font-medium mt-2">{quoteError}</p>
      )}

      {/* Real-Time Price Breakdown */}
      {quote && quote.available && (
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
      )}
    </div>
  );
}
