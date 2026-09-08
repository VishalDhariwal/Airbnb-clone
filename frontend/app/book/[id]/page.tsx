"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { BookingConfirmation, ListingDetail, QuoteResponse } from "@/lib/types";
import { BookingSummaryCard } from "@/components/book/BookingSummaryCard";

function BookContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, openLoginModal } = useAuth();
  const { showToast } = useToast();
  const listingId = Number(params.id);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stays parameters from URL query
  const [checkIn] = useState(
    () => searchParams.get("check_in") || new Date(Date.now() + 3 * 864e5).toISOString().split("T")[0]
  );
  const [checkOut] = useState(
    () => searchParams.get("check_out") || new Date(Date.now() + 4 * 864e5).toISOString().split("T")[0]
  );
  const [guests] = useState(() => Number(searchParams.get("guests")) || 2);

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
      const res = await api.post<BookingConfirmation>("/bookings", {
        listing_id: listingId,
        check_in: checkIn,
        check_out: checkOut,
        adults: guests,
        children: 0,
        infants: 0,
        pets: 0,
      });
      showToast(`Reservation confirmed! Code: ${res.confirmation_code}`, "success");
      router.push("/trips");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to confirm reservation";
      setError(msg);
      showToast(msg, "error");
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
        {/* Back Arrow & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/rooms/${listingId}`}
            className="w-10 h-10 rounded-full border border-hairline hover:bg-surface-soft transition flex items-center justify-center text-ink"
            aria-label="Back to listing"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Confirm and pay
          </h1>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Proceed to Payment */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink">Proceed to payment</h2>
              <p className="text-sm text-muted mt-1">
                You&apos;ll be directed to Razorpay to complete payment.
              </p>
            </div>

            <p className="text-xs text-bodytext pt-4 border-t border-hairline">
              By selecting the button, I agree to the{" "}
              <a href="#terms" className="underline font-semibold text-ink">
                booking terms
              </a>
              .
            </p>

            {error && <p className="text-xs text-danger font-medium">{error}</p>}

            <button
              type="button"
              onClick={handleConfirmAndPay}
              disabled={submitting}
              className="w-full max-w-sm py-3.5 bg-[#e01560] hover:bg-[#d70466] text-white rounded-xl font-semibold text-base transition shadow-sm disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Confirm and pay"}
            </button>
          </div>

          {/* Right Column: Reservation Summary Card */}
          <div className="lg:col-span-5">
            <BookingSummaryCard
              listing={listing}
              quote={quote}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onChangeDates={() => router.push(`/rooms/${listingId}`)}
              onChangeGuests={() => router.push(`/rooms/${listingId}`)}
            />
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-20 text-center">
          <p className="text-muted">Loading checkout...</p>
        </div>
      }
    >
      <BookContent />
    </Suspense>
  );
}
