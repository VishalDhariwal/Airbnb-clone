"use client";

import React from "react";

interface GuestFavoriteBannerProps {
  avgRating: number;
  reviewCount: number;
}

export function GuestFavoriteBanner({
  avgRating,
  reviewCount,
}: GuestFavoriteBannerProps) {
  return (
    <div className="border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 bg-white shadow-sm">
      {/* Left side: Laurel Emblem + Subtitle */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Laurel Emblem */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Left Laurel Branch */}
          <svg
            className="w-5 h-9 text-ink"
            viewBox="0 0 17 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.3 1.8c-.8 2.2-2.2 4.1-4 5.5.3-2.1.2-4.2-.5-6.1 1.7.1 3.3.4 4.5.6zm-5.7 7.7c-1.8 1.4-3.8 2.3-6 2.7 1.3-1.6 2.2-3.6 2.4-5.7 1.3.8 2.5 1.8 3.6 3zm-4.7 6.4c-1.9 1-3.9 1.5-6 1.6 1.7-1.2 3-2.9 3.7-4.9 1 .9 1.8 2 2.3 3.3zm-1.8 7.3c-1.6.8-3.3 1.2-5 1.2 1.6-1.1 2.7-2.7 3.3-4.5 1 .9 1.6 2 1.7 3.3zm2.5 6.5c-1 .5-2.1.8-3.2.9 1.2-.8 2-1.9 2.5-3.2.4.7.7 1.5.7 2.3z" />
          </svg>

          {/* Text inside emblem */}
          <div className="text-center leading-[1.1]">
            <span className="block text-xs sm:text-sm font-bold text-ink tracking-tight font-serif">
              Guest
            </span>
            <span className="block text-xs sm:text-sm font-bold text-ink tracking-tight font-serif">
              favourite
            </span>
          </div>

          {/* Right Laurel Branch (Mirrored) */}
          <svg
            className="w-5 h-9 text-ink scale-x-[-1]"
            viewBox="0 0 17 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.3 1.8c-.8 2.2-2.2 4.1-4 5.5.3-2.1.2-4.2-.5-6.1 1.7.1 3.3.4 4.5.6zm-5.7 7.7c-1.8 1.4-3.8 2.3-6 2.7 1.3-1.6 2.2-3.6 2.4-5.7 1.3.8 2.5 1.8 3.6 3zm-4.7 6.4c-1.9 1-3.9 1.5-6 1.6 1.7-1.2 3-2.9 3.7-4.9 1 .9 1.8 2 2.3 3.3zm-1.8 7.3c-1.6.8-3.3 1.2-5 1.2 1.6-1.1 2.7-2.7 3.3-4.5 1 .9 1.6 2 1.7 3.3zm2.5 6.5c-1 .5-2.1.8-3.2.9 1.2-.8 2-1.9 2.5-3.2.4.7.7 1.5.7 2.3z" />
          </svg>
        </div>

        {/* Text explanation */}
        <p className="text-xs sm:text-sm font-medium text-ink max-w-[210px] sm:max-w-[240px] leading-snug">
          One of the most loved homes on Airbnb, according to guests
        </p>
      </div>

      {/* Right side: Rating & Reviews with vertical divider */}
      <div className="flex items-center self-end sm:self-auto flex-shrink-0">
        {/* Rating Score */}
        <div className="text-center">
          <span className="block text-xl sm:text-2xl font-bold text-ink leading-none">
            {avgRating > 0 ? avgRating.toFixed(2) : "5.0"}
          </span>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                viewBox="0 0 32 32"
                className="w-2.5 h-2.5 fill-ink"
                aria-hidden="true"
              >
                <path d="M16 1l4.47 9.06 10 1.45-7.24 7.06 1.71 9.96L16 23.83 7.06 28.53l1.71-9.96L1.53 11.51l10-1.45z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Vertical Hairline Divider */}
        <div className="h-9 w-px bg-hairline mx-4 sm:mx-6" />

        {/* Review Count */}
        <div className="text-center">
          <span className="block text-xl sm:text-2xl font-bold text-ink leading-none">
            {reviewCount}
          </span>
          <span className="block text-xs font-semibold underline text-ink mt-1">
            Reviews
          </span>
        </div>
      </div>
    </div>
  );
}
