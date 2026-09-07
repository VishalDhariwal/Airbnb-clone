"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HostListing } from "@/lib/types/host";
import { formatCurrency } from "@/lib/format";
import { Star, ExternalLink, Edit3, Trash2, Power } from "lucide-react";

interface HostListingCardProps {
  listing: HostListing;
  onToggleActive: (id: number, currentStatus: boolean) => Promise<void>;
  onEdit: (listing: HostListing) => void;
  onDelete: (listing: HostListing) => void;
}

export function HostListingCard({
  listing,
  onToggleActive,
  onEdit,
  onDelete,
}: HostListingCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggleActive(listing.id, listing.is_active);
    } finally {
      setIsToggling(false);
    }
  };

  const defaultPhoto =
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
  const photoUrl = listing.cover_photo || defaultPhoto;

  return (
    <div className="bg-white border border-hairline rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col md:flex-row">
      {/* Thumbnail */}
      <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 bg-surface-soft">
        <img
          src={photoUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        {/* Status Pill Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
              listing.is_active
                ? "bg-emerald-500 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                listing.is_active ? "bg-white animate-pulse" : "bg-gray-400"
              }`}
            />
            {listing.is_active ? "Listed" : "Unlisted"}
          </span>
        </div>
      </div>

      {/* Main Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                {listing.property_type} • {listing.room_type}
              </p>
              <h3 className="text-lg font-semibold text-ink mt-0.5 line-clamp-1">
                {listing.title}
              </h3>
              <p className="text-sm text-muted">
                {listing.city}, {listing.state}
              </p>
            </div>
            {listing.review_count > 0 && (
              <div className="flex items-center gap-1 text-sm font-semibold text-ink flex-shrink-0">
                <Star className="w-4 h-4 fill-ink text-ink" />
                <span>{listing.avg_rating.toFixed(2)}</span>
                <span className="text-muted font-normal text-xs">
                  ({listing.review_count})
                </span>
              </div>
            )}
          </div>

          {/* Quick Specs */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-3">
            <span>{listing.max_guests} guests</span>
            <span>•</span>
            <span>{listing.bedrooms} bedr.</span>
            <span>•</span>
            <span>{listing.beds} beds</span>
            <span>•</span>
            <span>{listing.bathrooms} baths</span>
          </div>

          {/* Pricing & Performance summary */}
          <div className="mt-4 pt-3 border-t border-hairline-soft flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <span className="font-bold text-ink text-base">
                {formatCurrency(listing.price_per_night)}
              </span>{" "}
              <span className="text-muted text-xs">/ night</span>
              {listing.cleaning_fee > 0 && (
                <span className="text-xs text-muted ml-2">
                  (+{formatCurrency(listing.cleaning_fee)} cleaning)
                </span>
              )}
            </div>

            <div className="text-xs text-muted flex items-center gap-3">
              <span>
                <strong className="text-ink font-semibold">
                  {listing.total_reservations}
                </strong>{" "}
                bookings
              </span>
              <span>•</span>
              <span>
                <strong className="text-ink font-semibold">
                  {formatCurrency(listing.total_earnings || 0)}
                </strong>{" "}
                earned
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-hairline-soft flex items-center justify-between gap-2 flex-wrap">
          {/* Toggle Active Switch */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              listing.is_active
                ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {isToggling
              ? "Updating..."
              : listing.is_active
              ? "Unlist listing"
              : "Publish listing"}
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1">
            <Link
              href={`/rooms/${listing.id}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-ink hover:bg-surface-soft transition"
              title="Preview public listing"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
              <span>Preview</span>
            </Link>

            <button
              onClick={() => onEdit(listing)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-ink hover:bg-surface-soft transition"
              title="Edit listing details"
            >
              <Edit3 className="w-3.5 h-3.5 text-muted" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(listing)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
              title="Delete or unlist property"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
