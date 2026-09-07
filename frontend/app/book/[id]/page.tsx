"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { BookingConfirmation, ListingDetail, QuoteResponse } from "@/lib/types";
import { BookingSummaryCard } from "@/components/book/BookingSummaryCard";

function BookContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, openLoginModal } = useAuth();
  const listingId = Number(params.id);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stays parameters
  const [checkIn, setCheckIn] = useState(
    () => searchParams.get("check_in") || new Date(Date.now() + 3 * 864e5).toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    () => searchParams.get("check_out") || new Date(Date.now() + 6 * 864e5).toISOString().split("T")[0]
  );
  const [guests, setGuests] = useState(() => Number(searchParams.get("guests")) || 1);
  const [paymentOption, setPaymentOption] = useState<"full" | "part">("full");

  useEffect(() => {
    if (!listingId || isNaN(listingId)) return;
    setLoading(true);

    api
      .get<ListingDetail>(`/listings/${listingId}`)
      .then((data) => setListing(data))
      .catch((err) => setError(err?.message || "Listing not found"))
      .finally(() => setLoading(false));
  }, [listingId]);

  useEffect(() => {
    if (!listingId || !checkIn || !checkOut || checkOut <= checkIn) return;

    api
      .post<QuoteResponse>(`/listings/${listingId}/quote`, {
        check_in: checkIn,
        check_out: checkOut,
        guests,
      })
      .then((q) => setQuote(q))
      .catch(() => setQuote(null));
  }, [listingId, checkIn, checkOut, guests]);

  async function handleConfirmAndPay() {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!quote?.available) {
      setError("These dates are unavailable. Please choose another date range.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.post<BookingConfirmation>("/bookings", {
        listing_id: listingId,
        check_in: checkIn,
        check_out: checkOut,
        adults: guests,
        children: 0,
        infants: 0,
        pets: 0,
      });
      router.push("/trips");
    } catch (err: any) {
      setError(err?.message || "Failed to confirm reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-surface-strong rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 h-96 bg-surface-strong rounded-2xl" />
          <div className="lg:col-span-5 h-96 bg-surface-strong rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-ink mb-2">Listing not found</h2>
        <Link href="/" className="text-sm font-semibold underline text-ink">
          Return to explore
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 py-10">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/rooms/${listingId}`}
            className="p-2 rounded-full hover:bg-surface-soft transition text-ink"
            aria-label="Back to listing"
          >
            ‹
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Request to book
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form & Trip Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Trip Details */}
            <div className="pb-8 border-b border-hairline-soft space-y-4">
              <h2 className="text-xl font-bold text-ink">Your trip</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Dates</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 border border-hairline rounded-xl text-sm"
                    />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-hairline rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-hairline rounded-xl text-sm"
                  >
                    {Array.from({ length: listing.max_guests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Choose How to Pay */}
            <div className="pb-8 border-b border-hairline-soft space-y-3">
              <h2 className="text-xl font-bold text-ink">Choose how to pay</h2>
              <label className="flex items-center justify-between p-4 rounded-xl border border-ink bg-surface-soft cursor-pointer">
                <div>
                  <p className="text-sm font-bold text-ink">Pay in full</p>
                  <p className="text-xs text-muted">Pay the total amount now to guarantee your reservation</p>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === "full"}
                  onChange={() => setPaymentOption("full")}
                  className="accent-ink"
                />
              </label>
            </div>

            {/* 3. Cancellation Policy */}
            <div className="pb-8 border-b border-hairline-soft space-y-2">
              <h2 className="text-xl font-bold text-ink">Cancellation policy</h2>
              <p className="text-sm text-bodytext leading-relaxed">
                Free cancellation before check-in. Review the host&apos;s full policy for details.
              </p>
            </div>

            {/* 4. Ground Rules */}
            <div className="pb-8 border-b border-hairline-soft space-y-2">
              <h2 className="text-xl font-bold text-ink">Ground rules</h2>
              <p className="text-sm text-bodytext leading-relaxed">
                We ask every guest to remember a few simple rules about what makes a great guest:
                follow the house rules, treat your host&apos;s home like your own.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-danger border border-red-200 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleConfirmAndPay}
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-rausch to-rausch-active text-white rounded-xl font-bold text-base hover:opacity-95 disabled:opacity-50 transition shadow-md"
            >
              {submitting ? "Confirming reservation..." : "Confirm and pay"}
            </button>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5">
            <BookingSummaryCard listing={listing} quote={quote} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 animate-pulse">
          <div className="h-8 bg-surface-strong rounded w-1/4 mb-6" />
          <div className="h-96 bg-surface-strong rounded-2xl" />
        </div>
      }
    >
      <BookContent />
    </Suspense>
  );
}
