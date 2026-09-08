"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { formatCancellationDate, formatCurrency, formatDateDisplay } from "@/lib/format";
import { QuoteResponse } from "@/lib/types";
import { GuestCounts, GuestPopover } from "./GuestPopover";
import { BookingPriceBreakdown } from "./BookingPriceBreakdown";

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
  maxGuests,
}: BookingWidgetProps) {
  const router = useRouter();
  const guestBoxRef = useRef<HTMLDivElement>(null);

  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
  });

  const [guestCounts, setGuestCounts] = useState<GuestCounts>({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const totalGuests = Math.max(1, guestCounts.adults + guestCounts.children);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (guestBoxRef.current && !guestBoxRef.current.contains(event.target as Node)) {
        setIsGuestOpen(false);
      }
    }
    if (isGuestOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGuestOpen]);

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
        guests: totalGuests,
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
  }, [listingId, checkIn, checkOut, totalGuests]);

  function handleReserve() {
    if (!checkIn || !checkOut) return;
    router.push(
      `/book/${listingId}?check_in=${checkIn}&check_out=${checkOut}&guests=${totalGuests}`
    );
  }

  const isAvailable = quote ? quote.available : true;
  const originalPrice = Math.round(nightlyRate * 1.24);
  const stayNights = quote?.nights || 1;

  return (
    <div className="sticky top-28 z-10">
      {/* Top Banner Pill: Prices include all fees */}
      <div className="bg-white border border-hairline rounded-2xl p-3.5 shadow-sm flex items-center justify-center gap-2 mb-4">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-[#e01560] fill-[#e01560] flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7c0 .53.21 1.04.59 1.41l9 9a2 2 0 0 0 2.83 0l7-7a2 2 0 0 0 0-2.83zM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8z" />
        </svg>
        <span className="text-xs font-semibold text-ink">
          Prices include all fees
        </span>
      </div>

      {/* Main Reservation Card */}
      <div className="bg-white rounded-2xl border border-hairline shadow-[0_6px_20px_rgba(0,0,0,0.12)] p-6">
        {/* Price Header with Discount */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="line-through text-muted text-base font-normal">
            {formatCurrency(originalPrice)}
          </span>
          <span className="text-2xl font-bold text-ink underline decoration-2">
            {formatCurrency(nightlyRate)}
          </span>
          <span className="text-muted text-sm font-normal">
            for {stayNights} {stayNights === 1 ? "night" : "nights"}
          </span>
        </div>

        {/* Date & Guest Selectors Box */}
        <div className="border border-hairline rounded-xl mb-3">
          <div className="grid grid-cols-2 border-b border-hairline divide-x divide-hairline">
            <div className="p-2.5 relative cursor-pointer hover:bg-surface-soft/50 transition">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-ink cursor-pointer">
                CHECK-IN
              </label>
              <div className="text-xs font-medium text-ink mt-0.5">
                {formatDateDisplay(checkIn)}
              </div>
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>

            <div className="p-2.5 relative cursor-pointer hover:bg-surface-soft/50 transition">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-ink cursor-pointer">
                CHECKOUT
              </label>
              <div className="text-xs font-medium text-ink mt-0.5">
                {formatDateDisplay(checkOut)}
              </div>
              <input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>

          <div
            ref={guestBoxRef}
            className="p-2.5 relative cursor-pointer select-none hover:bg-surface-soft/50 transition rounded-b-xl"
            onClick={() => setIsGuestOpen((prev) => !prev)}
          >
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-ink cursor-pointer">
                  GUESTS
                </label>
                <div className="text-xs font-medium text-ink mt-0.5">
                  {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
                  {guestCounts.infants > 0 &&
                    `, ${guestCounts.infants} infant${guestCounts.infants > 1 ? "s" : ""}`}
                  {guestCounts.pets > 0 &&
                    `, ${guestCounts.pets} pet${guestCounts.pets > 1 ? "s" : ""}`}
                </div>
              </div>
              {isGuestOpen ? <ChevronUp className="w-4 h-4 text-ink" /> : <ChevronDown className="w-4 h-4 text-ink" />}
            </div>

            <GuestPopover
              isOpen={isGuestOpen}
              onClose={() => setIsGuestOpen(false)}
              counts={guestCounts}
              onChange={setGuestCounts}
              maxGuests={maxGuests}
            />
          </div>
        </div>

        {/* Free Cancellation Pill Badge */}
        <div className="my-3 py-2.5 px-3 bg-[#f2f2f2] rounded-xl text-center">
          <p className="text-xs text-ink">
            Free cancellation before <span className="font-semibold">{formatCancellationDate(checkIn)}</span>
          </p>
        </div>

        {/* Reserve Button */}
        <button
          type="button"
          onClick={handleReserve}
          disabled={loadingQuote || !isAvailable}
          className="w-full py-3.5 bg-[#e01560] hover:bg-[#d70466] text-white rounded-xl font-semibold text-base transition shadow-sm disabled:opacity-50"
        >
          {loadingQuote ? "Checking dates..." : !isAvailable ? "Dates unavailable" : "Reserve"}
        </button>

        <p className="text-center text-xs text-muted mt-3">You won&apos;t be charged yet</p>

        {quoteError && <p className="text-center text-xs text-danger font-medium mt-2">{quoteError}</p>}

        {/* Real-Time Price Breakdown */}
        {quote && quote.available && <BookingPriceBreakdown quote={quote} />}
      </div>

      {/* Report Listing Link */}
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink transition underline"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-muted" aria-hidden="true">
            <path d="M4 2v20h2v-6h12l-2-6 2-6H6V2H4z" />
          </svg>
          <span>Report this listing</span>
        </button>
      </div>
    </div>
  );
}
