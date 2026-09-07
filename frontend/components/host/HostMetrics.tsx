"use client";

import React from "react";
import { HostListing, HostReservation } from "@/lib/types/host";
import { formatCurrency } from "@/lib/format";
import { Home, CalendarCheck, TrendingUp, Star } from "lucide-react";

interface HostMetricsProps {
  listings: HostListing[];
  reservations: HostReservation[];
}

export function HostMetrics({ listings, reservations }: HostMetricsProps) {
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.is_active).length;
  const totalReservations = reservations.length;
  
  // Calculate total gross earnings from host listings or reservations
  const totalEarnings = listings.reduce((sum, l) => sum + (l.total_earnings || 0), 0);

  // Calculate weighted or average rating
  const ratedListings = listings.filter((l) => l.review_count > 0);
  const avgRating =
    ratedListings.length > 0
      ? (
          ratedListings.reduce((sum, l) => sum + l.avg_rating, 0) /
          ratedListings.length
        ).toFixed(2)
      : "5.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Metric 1: Listings */}
      <div className="bg-white border border-hairline rounded-2xl p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Listings
          </span>
          <div className="w-9 h-9 rounded-full bg-red-50 text-rausch flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-ink">
            {totalListings}
          </span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {activeListings} active
          </span>
        </div>
        <p className="text-xs text-muted mt-1">
          {totalListings - activeListings} unlisted properties
        </p>
      </div>

      {/* Metric 2: Total Reservations */}
      <div className="bg-white border border-hairline rounded-2xl p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Reservations
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-ink">
            {totalReservations}
          </span>
          <span className="text-xs text-muted">guest stays</span>
        </div>
        <p className="text-xs text-muted mt-1">Confirmed guest bookings</p>
      </div>

      {/* Metric 3: Gross Earnings */}
      <div className="bg-white border border-hairline rounded-2xl p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Gross Earnings
          </span>
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-ink truncate">
            {formatCurrency(totalEarnings)}
          </span>
        </div>
        <p className="text-xs text-muted mt-1">Total payout across listings</p>
      </div>

      {/* Metric 4: Average Rating */}
      <div className="bg-white border border-hairline rounded-2xl p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Rating & Quality
          </span>
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-ink">
            {avgRating}
          </span>
          <span className="text-xs text-muted">out of 5.0</span>
        </div>
        <p className="text-xs text-muted mt-1">
          Based on verified guest reviews
        </p>
      </div>
    </div>
  );
}
