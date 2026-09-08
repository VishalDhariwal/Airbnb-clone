"use client";

import React, { useState } from "react";
import { ListingDetail } from "@/lib/types";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useToast } from "@/lib/hooks/useToast";
import { Share2, Heart } from "lucide-react";

interface RoomHeaderProps {
  listing: ListingDetail;
}

export function RoomHeader({ listing }: RoomHeaderProps) {
  const { isSaved, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const saved = isSaved(listing.id);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Listing link copied to clipboard!", "info");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Could not copy link", "error");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pt-2 pb-4">
      {/* Listing Title */}
      <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold text-ink tracking-tight flex-1">
        {listing.title}
      </h1>

      {/* Share & Save Action Buttons */}
      <div className="flex items-center gap-4 text-sm font-semibold text-ink flex-shrink-0">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 hover:underline transition p-1"
          aria-label="Share listing"
        >
          <Share2 className="w-4 h-4 text-ink" />
          <span className="underline">{copied ? "Copied!" : "Share"}</span>
        </button>

        <button
          onClick={() => toggleWishlist(listing.id)}
          className="flex items-center gap-2 hover:underline transition p-1"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition ${
              saved ? "fill-rausch text-rausch" : "text-ink"
            }`}
          />
          <span className="underline">{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}
