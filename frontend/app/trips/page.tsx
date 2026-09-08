"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { TripsResponse } from "@/lib/types";
import { TripCard } from "@/components/trips/TripCard";
import { TripCardSkeleton } from "@/components/ui/Skeleton";

export default function TripsPage() {
  const { user, loading: authLoading, openLoginModal } = useAuth();
  const { showToast } = useToast();
  const [trips, setTrips] = useState<TripsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  async function fetchTrips() {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<TripsResponse>("/bookings/me");
      setTrips(data);
    } catch (err) {
      console.error("Failed to load trips:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrips();
  }, [user]);

  async function handleCancelBooking(bookingId: number) {
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      showToast("Reservation cancelled", "info");
      await fetchTrips();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel reservation";
      showToast(msg, "error");
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-surface-strong rounded w-1/4" />
        <div className="h-40 bg-surface-strong rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-5xl">✈️</span>
        <h1 className="text-2xl font-bold text-ink">No trips booked... yet!</h1>
        <p className="text-sm text-muted">
          Log in to your account to view your confirmed reservations and past travels.
        </p>
        <button
          onClick={openLoginModal}
          className="px-6 py-3 bg-gradient-to-r from-rausch to-rausch-active text-white rounded-xl text-sm font-semibold hover:opacity-95 transition shadow-sm"
        >
          Log in or sign up
        </button>
      </div>
    );
  }

  const upcoming = trips?.upcoming || [];
  const past = trips?.past || [];
  const currentList = activeTab === "upcoming" ? upcoming : past;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 py-10">
        <h1 className="text-3xl font-bold text-ink mb-6 tracking-tight">Trips</h1>

        {/* Tab Switcher */}
        <div className="flex gap-8 border-b border-hairline-soft mb-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-sm font-semibold transition relative ${
              activeTab === "upcoming"
                ? "text-ink border-b-2 border-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 text-sm font-semibold transition relative ${
              activeTab === "past"
                ? "text-ink border-b-2 border-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            Past ({past.length})
          </button>
        </div>

        {/* Trip Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TripCardSkeleton />
            <TripCardSkeleton />
          </div>
        ) : currentList.length === 0 ? (
          <div className="py-16 text-center max-w-sm mx-auto space-y-4">
            <span className="text-4xl">🏖️</span>
            <h3 className="text-lg font-bold text-ink">
              {activeTab === "upcoming" ? "No upcoming trips" : "No past trips"}
            </h3>
            <p className="text-xs text-muted">
              {activeTab === "upcoming"
                ? "Time to dust off your bags and start planning your next getaway."
                : "You don't have any past stays on record."}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-ink text-white rounded-xl text-xs font-semibold hover:opacity-90 transition"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentList.map((booking) => (
              <TripCard
                key={booking.id}
                booking={booking}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
