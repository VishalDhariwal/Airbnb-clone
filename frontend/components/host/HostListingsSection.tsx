"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HostListing } from "@/lib/types/host";
import { HostListingCard } from "./HostListingCard";
import { Plus, Search, Home } from "lucide-react";

interface HostListingsSectionProps {
  listings: HostListing[];
  onToggleActive: (id: number, currentStatus: boolean) => Promise<void>;
  onEdit: (listing: HostListing) => void;
  onDelete: (listing: HostListing) => void;
}

export function HostListingsSection({
  listings,
  onToggleActive,
  onEdit,
  onDelete,
}: HostListingsSectionProps) {
  const [filter, setFilter] = useState<"all" | "active" | "unlisted">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Status filter
      if (filter === "active" && !l.is_active) return false;
      if (filter === "unlisted" && l.is_active) return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = l.title.toLowerCase().includes(q);
        const matchCity = l.city.toLowerCase().includes(q);
        const matchState = l.state.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchState) return false;
      }

      return true;
    });
  }, [listings, filter, searchQuery]);

  const activeCount = listings.filter((l) => l.is_active).length;
  const unlistedCount = listings.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Controls Bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-surface-soft p-1 rounded-xl w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "all"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            All ({listings.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "active"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter("unlisted")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "unlisted"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Unlisted ({unlistedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
      </div>

      {/* Listings List */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredListings.map((listing) => (
            <HostListingCard
              key={listing.id}
              listing={listing}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white border border-hairline rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-surface-soft text-muted mx-auto flex items-center justify-center mb-3">
            <Home className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-ink">
            {listings.length === 0
              ? "You don't have any listings yet"
              : "No listings match your filter"}
          </h3>
          <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
            {listings.length === 0
              ? "Start earning by sharing your space with travellers from around the world."
              : "Try clearing your search or switching to another filter."}
          </p>
          {listings.length === 0 && (
            <div className="mt-5">
              <Link
                href="/host/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rausch hover:bg-rausch-active text-white text-sm font-semibold shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create your first listing</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
