"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { ListingCard as ListingCardType } from "@/lib/types";
import { StarIcon } from "@/components/ui/Icons";

interface ListingCardProps {
  listing: ListingCardType;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { isSaved, toggleWishlist } = useWishlist();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : [{ id: 0, url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80", position: 0 }];

  const saved = isSaved(listing.id);

  function handlePrev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }

  async function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsHeartAnimating(true);
    await toggleWishlist(listing.id);
    setTimeout(() => setIsHeartAnimating(false), 200);
  }

  return (
    <div className="group flex flex-col cursor-pointer">
      {/* Image Container with Carousel */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-soft mb-3">
        <Link href={`/rooms/${listing.id}`} className="block w-full h-full">
          <img
            src={photos[photoIndex]?.url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Guest Favourite Badge */}
        {listing.is_guest_favorite && (
          <div className="absolute top-3 left-3 bg-white/95 text-ink font-semibold text-[11px] px-2.5 py-1 rounded-full shadow-sm tracking-tight backdrop-blur-sm z-10 pointer-events-none">
            Guest favourite
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleHeartClick}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full hover:scale-110 active:scale-95 transition-transform z-10 ${
            isHeartAnimating ? "scale-125" : ""
          }`}
        >
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-white stroke-[2.5] overflow-visible drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            fill={saved ? "#FF385C" : "rgba(0, 0, 0, 0.45)"}
          >
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-4.58.31-7 4.02C13.58 4.31 10.8 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
          </svg>
        </button>

        {/* Prev / Next Chevrons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-ink shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95 z-10"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-ink shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95 z-10"
            >
              ›
            </button>
          </>
        )}

        {/* Carousel Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
            {photos.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === photoIndex ? "bg-white scale-125" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Listing Info */}
      <Link href={`/rooms/${listing.id}`} className="flex flex-col gap-0.5 text-sm">
        {/* Title + Rating Row */}
        <div className="flex items-center justify-between font-semibold text-ink">
          <span className="truncate pr-2">
            {listing.city}, India
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <StarIcon className="w-3.5 h-3.5 text-ink" />
            <span className="text-xs">
              {listing.review_count > 0 ? listing.avg_rating.toFixed(2) : "New"}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-muted text-xs truncate">
          {listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1)} · {listing.room_type}
        </p>

        {/* Dates */}
        <p className="text-muted text-xs">
          Available now
        </p>

        {/* Price */}
        <p className="text-ink mt-1">
          <span className="font-semibold">{formatCurrency(listing.price_per_night)}</span>
          <span className="text-xs text-muted font-normal"> night</span>
        </p>
      </Link>
    </div>
  );
}
