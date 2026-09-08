"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { ListingCard as ListingCardType } from "@/lib/types";
import { StarIcon } from "@/components/ui/Icons";
import { easeStandard, heartTap, springFast } from "@/lib/motion";

interface ListingCardProps {
  listing: ListingCardType;
  /**
   * "carousel" is the homepage card (reference 03): square photo, one meta line.
   * "search" is the results-grid card (reference 10): 5:4 photo, rating pulled to the
   * right of the title, then subtitle / beds / underlined price / cancellation.
   * They really are two different cards on the live site.
   */
  variant?: "carousel" | "search";
  /** Deprecated alias for variant="carousel". */
  compact?: boolean;
  priority?: boolean;
}

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

function titleFor(listing: ListingCardType) {
  const type = listing.property_type
    ? listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1)
    : "Home";
  return `${type} in ${listing.city}`;
}

/**
 * The property card (DESIGN_SYSTEM.md §7.3, reference 03).
 *
 * No border, no background, no card shadow — a square photo on white with two lines
 * under it. The photo carousel slides rather than cuts, the chevrons only exist on
 * hover, and the heart squashes then overshoots on tap. Everything else is still.
 */
export function ListingCard({
  listing,
  variant = "carousel",
  priority = false,
}: ListingCardProps) {
  const isSearch = variant === "search";
  const { isSaved, toggleWishlist } = useWishlist();
  const [[photoIndex, direction], setPhoto] = useState<[number, number]>([0, 0]);

  const photos =
    listing.photos && listing.photos.length > 0
      ? listing.photos
      : [{ id: 0, url: FALLBACK_PHOTO, position: 0 }];

  const saved = isSaved(listing.id);

  function paginate(delta: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhoto(([i]) => [(i + delta + photos.length) % photos.length, delta]);
  }

  function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    void toggleWishlist(listing.id);
  }

  const rating =
    listing.review_count > 0
      ? listing.avg_rating.toFixed(listing.avg_rating === 5 ? 1 : 2)
      : null;

  return (
    <div className="group flex min-w-0 flex-col">
      <div
        className={`relative mb-3 w-full overflow-hidden rounded-md bg-surface-soft ${
          isSearch ? "aspect-[5/4]" : "aspect-square"
        }`}
      >
        <Link
          href={`/rooms/${listing.id}`}
          className="block h-full w-full transition-transform duration-[450ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={photoIndex}
              src={photos[photoIndex]?.url ?? FALLBACK_PHOTO}
              alt={listing.title}
              custom={direction}
              initial={{ x: direction === 0 ? 0 : direction > 0 ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: direction > 0 ? "-100%" : "100%" }}
              transition={{ duration: 0.35, ease: easeStandard }}
              loading={priority ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </Link>

        {listing.is_guest_favorite && (
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 t-badge text-ink shadow-card">
            {isSearch && <span aria-hidden="true">🏆</span>}
            Guest favourite
          </div>
        )}

        <motion.button
          onClick={handleHeartClick}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={saved ? heartTap : { scale: 1 }}
          transition={springFast}
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full"
        >
          <svg
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="h-6 w-6 overflow-visible stroke-white stroke-[2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-colors duration-200"
            style={{ fill: saved ? "#FF385C" : "rgba(0,0,0,0.4)" }}
          >
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-4.58.31-7 4.02C13.58 4.31 10.8 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
          </svg>
        </motion.button>

        {photos.length > 1 && (
          <>
            <ArrowButton side="left" onClick={(e) => paginate(-1, e)} />
            <ArrowButton side="right" onClick={(e) => paginate(1, e)} />

            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {photos.slice(0, 5).map((_, idx) => (
                <motion.span
                  key={idx}
                  className="rounded-full bg-white"
                  initial={false}
                  animate={{
                    width: idx === photoIndex ? 7 : 5,
                    height: idx === photoIndex ? 7 : 5,
                    opacity: idx === photoIndex ? 1 : 0.6,
                  }}
                  transition={springFast}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isSearch ? (
        <Link href={`/rooms/${listing.id}`} className="flex min-w-0 flex-col gap-[3px]">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate t-title-md text-ink">{titleFor(listing)}</span>
            {rating && (
              <span className="flex shrink-0 items-center gap-1 t-body-sm text-ink">
                <StarIcon className="h-3 w-3" />
                {rating}
                <span className="text-muted">({listing.review_count})</span>
              </span>
            )}
          </div>
          <span className="truncate t-body-sm text-muted">{listing.title}</span>
          <span className="truncate t-body-sm text-muted">
            {listing.room_type === "entire" ? "Entire home" : "Private room"}
          </span>
          <span className="mt-0.5 t-body-sm text-ink">
            <span className="font-semibold underline underline-offset-2">
              {formatCurrency(listing.price_per_night)}
            </span>{" "}
            for 1 night
          </span>
          <span className="text-[12px] text-muted">Free cancellation</span>
        </Link>
      ) : (
        <Link href={`/rooms/${listing.id}`} className="flex min-w-0 flex-col gap-1">
          <span className="truncate t-title-md text-ink">{titleFor(listing)}</span>
          <span className="truncate t-body-sm text-muted">
            {formatCurrency(listing.total_price)} for {listing.nights}{" "}
            {listing.nights === 1 ? "night" : "nights"}
            {rating && (
              <>
                {" · "}
                <span className="inline-flex items-center gap-0.5 text-ink">
                  <StarIcon className="h-3 w-3 -translate-y-px" />
                  {rating}
                </span>
              </>
            )}
          </span>
        </Link>
      )
      }
    </div>
  );
}

function ArrowButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      initial={{ opacity: 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={springFast}
      className={`absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={2.5} />
    </motion.button>
  );
}
