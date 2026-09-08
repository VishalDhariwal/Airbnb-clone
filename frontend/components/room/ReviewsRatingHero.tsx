"use client";

import React from "react";
import { motion } from "framer-motion";
import { easeStandard, springMedium } from "@/lib/motion";

interface ReviewsRatingHeroProps {
  avgRating: number;
  ratingAverages?: {
    cleanliness?: number;
    accuracy?: number;
    check_in?: number;
    communication?: number;
    location?: number;
    value?: number;
  };
}

export function ReviewsRatingHero({
  avgRating = 4.95,
  ratingAverages,
}: ReviewsRatingHeroProps) {
  const cleanliness = ratingAverages?.cleanliness ?? 4.8;
  const accuracy = ratingAverages?.accuracy ?? 5.0;
  const checkIn = ratingAverages?.check_in ?? 4.7;
  const communication = ratingAverages?.communication ?? 4.9;
  const location = ratingAverages?.location ?? 5.0;
  const value = ratingAverages?.value ?? 4.9;

  return (
    <div className="py-12 border-b border-hairline space-y-10">
      {/* Big Guest Favourite Laurel Hero */}
      <div className="text-center space-y-2">
        <motion.div
          className="flex items-center justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: easeStandard }}
        >
          {/* Left Laurel Branch */}
          <svg
            className="w-10 sm:w-12 h-20 sm:h-24 text-[#222222] drop-shadow-sm"
            viewBox="0 0 17 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.3 1.8c-.8 2.2-2.2 4.1-4 5.5.3-2.1.2-4.2-.5-6.1 1.7.1 3.3.4 4.5.6zm-5.7 7.7c-1.8 1.4-3.8 2.3-6 2.7 1.3-1.6 2.2-3.6 2.4-5.7 1.3.8 2.5 1.8 3.6 3zm-4.7 6.4c-1.9 1-3.9 1.5-6 1.6 1.7-1.2 3-2.9 3.7-4.9 1 .9 1.8 2 2.3 3.3zm-1.8 7.3c-1.6.8-3.3 1.2-5 1.2 1.6-1.1 2.7-2.7 3.3-4.5 1 .9 1.6 2 1.7 3.3zm2.5 6.5c-1 .5-2.1.8-3.2.9 1.2-.8 2-1.9 2.5-3.2.4.7.7 1.5.7 2.3z" />
          </svg>

          {/* Giant Score */}
          <motion.span
            className="t-rating-display select-none text-ink"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={springMedium}
          >
            {avgRating > 0 ? avgRating.toFixed(2) : "4.95"}
          </motion.span>

          {/* Right Laurel Branch (Mirrored) */}
          <svg
            className="w-10 sm:w-12 h-20 sm:h-24 text-[#222222] scale-x-[-1] drop-shadow-sm"
            viewBox="0 0 17 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.3 1.8c-.8 2.2-2.2 4.1-4 5.5.3-2.1.2-4.2-.5-6.1 1.7.1 3.3.4 4.5.6zm-5.7 7.7c-1.8 1.4-3.8 2.3-6 2.7 1.3-1.6 2.2-3.6 2.4-5.7 1.3.8 2.5 1.8 3.6 3zm-4.7 6.4c-1.9 1-3.9 1.5-6 1.6 1.7-1.2 3-2.9 3.7-4.9 1 .9 1.8 2 2.3 3.3zm-1.8 7.3c-1.6.8-3.3 1.2-5 1.2 1.6-1.1 2.7-2.7 3.3-4.5 1 .9 1.6 2 1.7 3.3zm2.5 6.5c-1 .5-2.1.8-3.2.9 1.2-.8 2-1.9 2.5-3.2.4.7.7 1.5.7 2.3z" />
          </svg>
        </motion.div>

        <h3 className="t-display-sm text-ink">Guest favourite</h3>
        <p className="text-sm text-muted max-w-sm mx-auto leading-snug">
          This home is a guest favourite based on ratings, reviews and reliability
        </p>
        <button
          type="button"
          onClick={() => {}}
          className="text-xs font-semibold underline text-ink hover:text-muted transition block mx-auto pt-1"
        >
          How reviews work
        </button>
      </div>

      {/* 7 Columns Metrics Breakdown */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-7 min-w-[700px] divide-x divide-hairline items-stretch">
          {/* 1. Overall Rating Bars */}
          <div className="px-3 sm:px-4 flex flex-col justify-between">
            <span className="t-body-sm font-medium text-ink">Overall rating</span>
            <div className="space-y-1 my-2">
              {[
                { star: 5, pct: 90 },
                { star: 4, pct: 10 },
                { star: 3, pct: 0 },
                { star: 2, pct: 0 },
                { star: 1, pct: 0 },
              ].map((row) => (
                <div key={row.star} className="flex items-center gap-1.5 text-[10px] text-ink font-medium">
                  <span className="w-2">{row.star}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-hairline">
                    <motion.div
                      className="h-1 rounded-full bg-ink"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: easeStandard, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Cleanliness */}
          <div className="px-3 sm:px-4 flex flex-col justify-between">
            <div>
              <span className="t-body-sm font-medium text-ink">Cleanliness</span>
              <p className="mt-0.5 t-title-md text-ink">{cleanliness.toFixed(1)}</p>
            </div>
            {/* Spray Bottle Icon */}
            <div className="mt-4 text-ink">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
                <path d="M14 4h4v3h-4zM16 7v4M12 11h8l-1.5 10h-5L12 11zM10 7L7 5l1-2 4 2.5" />
              </svg>
            </div>
          </div>

          {/* 3. Accuracy */}
          <div className="px-3 sm:px-4 flex flex-col justify-between">
            <div>
              <span className="t-body-sm font-medium text-ink">Accuracy</span>
              <p className="mt-0.5 t-title-md text-ink">{accuracy.toFixed(1)}</p>
            </div>
            {/* Checkmark Circle Icon */}
            <div className="mt-4 text-ink">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>

          {/* 4. Check-in */}
          <div className="px-3 sm:px-4 flex flex-col justify-between">
            <div>
              <span className="t-body-sm font-medium text-ink">Check-in</span>
              <p className="mt-0.5 t-title-md text-ink">{checkIn.toFixed(1)}</p>
            </div>
            {/* Key Icon */}
            <div className="mt-4 text-ink">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
                <circle cx="7.5" cy="15.5" r="4.5" />
                <path d="M10.5 12.5L21 2v4h-3v3h-3v3.5" />
              </svg>
            </div>
          </div>

          {/* 5. Communication */}
          <div className="px-3 sm:px-4 flex flex-col justify-between">
            <div>
              <span className="t-body-sm font-medium text-ink">Communication</span>
              <p className="mt-0.5 t-title-md text-ink">{communication.toFixed(1)}</p>
            </div>
            {/* Speech Bubble Icon */}
            <div className="mt-4 text-ink">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>

          {/* 6. Location */}
          <div className="px-3 sm:px-4 flex flex-col justify-between">
            <div>
              <span className="t-body-sm font-medium text-ink">Location</span>
              <p className="mt-0.5 t-title-md text-ink">{location.toFixed(1)}</p>
            </div>
            {/* Folded Map Icon */}
            <div className="mt-4 text-ink">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </div>
          </div>

          {/* 7. Value */}
          <div className="px-3 sm:px-4 flex flex-col justify-between">
            <div>
              <span className="t-body-sm font-medium text-ink">Value</span>
              <p className="mt-0.5 t-title-md text-ink">{value.toFixed(1)}</p>
            </div>
            {/* Price Tag Icon */}
            <div className="mt-4 text-ink">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
