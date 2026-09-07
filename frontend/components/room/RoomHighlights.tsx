"use client";

import React from "react";
import { ListingDetail } from "@/lib/types";

interface RoomHighlightsProps {
  listing: ListingDetail;
}

export function RoomHighlights({ listing }: RoomHighlightsProps) {
  // If the listing has pool/outdoor amenities, or by default render the outdoor entertainment highlight
  return (
    <div className="py-6 border-b border-hairline space-y-6">
      {/* Highlight 1: Outdoor entertainment */}
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 flex-shrink-0 mt-0.5 text-ink">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-ink"
            aria-hidden="true"
          >
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            <path d="M4 8h16l-1.5 12a2 2 0 0 1-2 1.8H7.5A2 2 0 0 1 5.5 20L4 8z" />
            <line x1="4" y1="8" x2="20" y2="8" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Outdoor entertainment</h4>
          <p className="text-xs text-muted mt-0.5">
            The sunbeds and pool are great for summer trips.
          </p>
        </div>
      </div>

      {/* Highlight 2: Self check-in */}
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 flex-shrink-0 mt-0.5 text-ink">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-ink"
            aria-hidden="true"
          >
            <rect x="4" y="3" width="16" height="18" rx="1" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Self check-in</h4>
          <p className="text-xs text-muted mt-0.5">
            You can check in with the building staff.
          </p>
        </div>
      </div>

      {/* Highlight 3: Peace and quiet */}
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 flex-shrink-0 mt-0.5 text-ink">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-ink"
            aria-hidden="true"
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Peace and quiet</h4>
          <p className="text-xs text-muted mt-0.5">
            Guests say this home is in a quiet area.
          </p>
        </div>
      </div>
    </div>
  );
}
