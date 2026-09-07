"use client";

import React, { useState } from "react";
import { ListingDetail } from "@/lib/types";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { StarIcon, UserAvatarIcon } from "@/components/ui/Icons";

interface RoomHeaderProps {
  listing: ListingDetail;
}

export function RoomHeader({ listing }: RoomHeaderProps) {
  const { isSaved, toggleWishlist } = useWishlist();
  const [copied, setCopied] = useState(false);

  const saved = isSaved(listing.id);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="space-y-4">
      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          {listing.title}
        </h1>

        <div className="flex items-center gap-4 text-sm font-semibold text-ink flex-shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 hover:underline transition p-1"
          >
            <span>↗</span>
            <span>{copied ? "Link copied!" : "Share"}</span>
          </button>

          <button
            onClick={() => toggleWishlist(listing.id)}
            className="flex items-center gap-2 hover:underline transition p-1"
          >
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 stroke-current stroke-2 overflow-visible"
              fill={saved ? "#FF385C" : "none"}
              stroke={saved ? "#FF385C" : "currentColor"}
            >
              <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-4.58.31-7 4.02C13.58 4.31 10.8 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
            </svg>
            <span>{saved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Guest Favourite Banner (Reference 14) */}
      {listing.is_guest_favorite && (
        <div className="p-5 rounded-2xl border border-hairline-soft bg-surface-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold text-base text-ink">Guest favourite</p>
              <p className="text-xs text-muted">
                One of the most loved homes on Airbnb based on ratings, reviews, and reliability
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-ink flex items-center gap-1 justify-end">
              <span>{listing.avg_rating.toFixed(2)}</span>
              <StarIcon className="w-4 h-4 text-ink inline" />
            </div>
            <p className="text-xs text-muted underline">{listing.review_count} reviews</p>
          </div>
        </div>
      )}

      {/* Host & Capacity Overview */}
      <div className="py-4 border-b border-hairline-soft flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            {listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1)} in{" "}
            {listing.city}, India
          </h2>
          <p className="text-sm text-muted mt-0.5">
            {listing.max_guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds ·{" "}
            {listing.bathrooms} bathrooms
          </p>
        </div>

        {/* Host Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-hairline flex items-center justify-center bg-surface-soft flex-shrink-0">
            {listing.host.avatar_url ? (
              <img
                src={listing.host.avatar_url}
                alt={listing.host.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserAvatarIcon className="w-8 h-8 text-muted" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
