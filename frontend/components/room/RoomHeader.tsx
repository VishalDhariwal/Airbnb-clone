"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share, Heart } from "lucide-react";
import { ListingDetail } from "@/lib/types";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useToast } from "@/lib/hooks/useToast";
import { heartTap, springFast } from "@/lib/motion";

/** Reference 13: h1 on the left, Share / Save as underlined text links on the right. */
export function RoomHeader({ listing }: { listing: ListingDetail }) {
  const { isSaved, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const saved = isSaved(listing.id);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Listing link copied to clipboard", "info");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Could not copy link", "error");
    }
  }

  return (
    <div className="flex flex-col justify-between gap-3 pb-4 pt-2 sm:flex-row sm:items-center">
      <h1 className="flex-1 text-[22px] font-semibold leading-[1.2] tracking-[-0.4px] text-ink sm:text-[26px]">
        {listing.title}
      </h1>

      <div className="flex shrink-0 items-center gap-1">
        <motion.button
          onClick={handleShare}
          whileTap={{ scale: 0.95 }}
          transition={springFast}
          aria-label="Share listing"
          className="flex items-center gap-2 rounded-lg px-3 py-2 t-button-sm font-semibold text-ink transition-colors duration-150 hover:bg-surface-soft"
        >
          <Share className="h-4 w-4" />
          <span className="underline underline-offset-2">
            {copied ? "Copied" : "Share"}
          </span>
        </motion.button>

        <motion.button
          onClick={() => toggleWishlist(listing.id)}
          whileTap={{ scale: 0.95 }}
          animate={saved ? heartTap : { scale: 1 }}
          transition={springFast}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="flex items-center gap-2 rounded-lg px-3 py-2 t-button-sm font-semibold text-ink transition-colors duration-150 hover:bg-surface-soft"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              saved ? "fill-rausch text-rausch" : "text-ink"
            }`}
          />
          <span className="underline underline-offset-2">{saved ? "Saved" : "Save"}</span>
        </motion.button>
      </div>
    </div>
  );
}
