"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HostReservation } from "@/lib/types/host";
import { formatCurrency } from "@/lib/format";
import { Calendar, User, Search, CheckCircle2, XCircle } from "lucide-react";

interface HostReservationsTableProps {
  reservations: HostReservation[];
}

export function HostReservationsTable({
  reservations,
}: HostReservationsTableProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past" | "cancelled">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      // Filter tab
      if (filter === "cancelled" && r.status !== "CANCELLED") return false;
      if (filter === "upcoming") {
        if (r.status === "CANCELLED" || r.check_in < today) return false;
      }
      if (filter === "past") {
        if (r.status === "CANCELLED" || r.check_in >= today) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchGuest = r.guest.name.toLowerCase().includes(q);
        const matchListing = r.listing_title.toLowerCase().includes(q);
        const matchCode = r.confirmation_code.toLowerCase().includes(q);
        if (!matchGuest && !matchListing && !matchCode) return false;
      }

      return true;
    });
  }, [reservations, filter, searchQuery, today]);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-surface-soft p-1 rounded-xl w-fit overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === "all"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            All ({reservations.length})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === "upcoming"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === "past"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === "cancelled"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guest or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
      </div>

      {/* Reservations Table / Cards */}
      {filteredReservations.length > 0 ? (
        <div className="bg-white border border-hairline rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-soft border-b border-hairline text-muted uppercase font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Guest</th>
                  <th className="py-3.5 px-4">Listing</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4 text-right">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-soft">
                {filteredReservations.map((res) => {
                  const isCancelled = res.status === "CANCELLED";
                  return (
                    <tr
                      key={res.id}
                      className="hover:bg-surface-soft/60 transition"
                    >
                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            isCancelled
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isCancelled ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {res.status}
                        </span>
                      </td>

                      {/* Guest */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-soft flex-shrink-0 flex items-center justify-center text-muted font-bold text-xs">
                            {res.guest.avatar_url ? (
                              <img
                                src={res.guest.avatar_url}
                                alt={res.guest.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">
                              {res.guest.name}
                            </p>
                            <p className="text-muted text-[11px]">
                              {res.adults + res.children} guests
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Listing */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          href={`/rooms/${res.listing_id}`}
                          className="font-medium text-ink hover:underline line-clamp-1"
                        >
                          {res.listing_title}
                        </Link>
                        <p className="text-muted text-[11px]">{res.listing_city}</p>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-medium text-ink">
                          {res.check_in} → {res.check_out}
                        </p>
                        <p className="text-muted text-[11px]">
                          {res.nights} {res.nights === 1 ? "night" : "nights"}
                        </p>
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-medium text-muted bg-surface-soft px-2 py-1 rounded">
                          {res.confirmation_code}
                        </span>
                      </td>

                      {/* Payout */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-ink">
                        {formatCurrency(res.total_price)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white border border-hairline rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-surface-soft text-muted mx-auto flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-ink">
            No reservations found
          </h3>
          <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
            {reservations.length === 0
              ? "When guests book your listings, their reservation details will appear here."
              : "No reservations matched your current filter criteria."}
          </p>
        </div>
      )}
    </div>
  );
}
