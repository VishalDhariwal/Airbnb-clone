"use client";

import React from "react";
import { ListingPhoto } from "@/lib/types";

interface WhereYouSleepProps {
  photos?: ListingPhoto[];
}

export function WhereYouSleep({ photos = [] }: WhereYouSleepProps) {
  // Use listing photos or elegant fallback interior photos
  const bedroomPhoto =
    photos[1]?.url ||
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80";
  const livingPhoto =
    photos[2]?.url ||
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80";

  return (
    <div className="py-8 border-b border-hairline space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-ink">
        Where you&apos;ll sleep
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bedroom Card */}
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-surface-soft border border-hairline/60">
            <img
              src={bedroomPhoto}
              alt="Bedroom"
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
          <div>
            <h4 className="text-base font-semibold text-ink">Bedroom</h4>
            <p className="text-xs text-muted mt-0.5">
              1 double bed, 1 floor mattress
            </p>
          </div>
        </div>

        {/* Living Room Card */}
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-surface-soft border border-hairline/60">
            <img
              src={livingPhoto}
              alt="Living room"
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
          <div>
            <h4 className="text-base font-semibold text-ink">Living room</h4>
            <p className="text-xs text-muted mt-0.5">1 sofa bed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
