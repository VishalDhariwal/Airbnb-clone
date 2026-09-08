"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { springFast, staggerContainer, fadeUpVariants } from "@/lib/motion";
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
        <h1 className="t-display-lg text-ink">No trips booked… yet!</h1>
        <p className="text-sm text-muted">
          Log in to your account to view your confirmed reservations and past travels.
        </p>
        <button
          onClick={openLoginModal}
          className="h-12 rounded-sm bg-rausch px-6 t-button-md font-semibold text-white transition-colors duration-150 hover:bg-rausch-active"
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
        <h1 className="mb-6 text-[32px] font-semibold tracking-[-0.6px] text-ink">Trips</h1>

        {/* Tab switcher — the underline is a shared layout element, so it slides */}
        <div className="mb-8 flex gap-8 border-b border-hairline-soft">
          {([
            { id: "upcoming" as const, label: `Upcoming (${upcoming.length})` },
            { id: "past" as const, label: `Past (${past.length})` },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-3 t-button-md font-semibold transition-colors duration-150"
            >
              <span className={activeTab === tab.id ? "text-ink" : "text-muted hover:text-ink"}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.span
                  layoutId="trips-tab-underline"
                  transition={springFast}
                  className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-ink"
                />
              )}
            </button>
          ))}
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
            <h3 className="t-display-sm text-ink">
              {activeTab === "upcoming" ? "No upcoming trips" : "No past trips"}
            </h3>
            <p className="text-xs text-muted">
              {activeTab === "upcoming"
                ? "Time to dust off your bags and start planning your next getaway."
                : "You don't have any past stays on record."}
            </p>
            <Link
              href="/"
              className="inline-block rounded-sm bg-ink px-6 py-3 t-button-md font-semibold text-white transition-opacity duration-150 hover:opacity-90"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {currentList.map((booking) => (
                <motion.div key={booking.id} variants={fadeUpVariants}>
                  <TripCard booking={booking} onCancelBooking={handleCancelBooking} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
