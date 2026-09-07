"use client";

import React, { useState } from "react";
import { Amenity } from "@/lib/types";
import { CloseIcon } from "@/components/ui/Icons";

const AMENITY_ICONS: Record<string, string> = {
  wifi: "📶",
  kitchen: "🍳",
  ac: "❄️",
  pool: "🏊",
  parking: "🚗",
  workspace: "💻",
  tv: "📺",
  washer: "🧺",
  gym: "🏋️",
  fireplace: "🔥",
  bbq: "🍖",
  balcony: "🌅",
  garden: "🌺",
  cctv: "📹",
  generator: "⚡",
};

interface RoomAmenitiesProps {
  description: string;
  amenities: Amenity[];
  amenitiesGrouped?: Record<string, Amenity[]>;
}

export function RoomAmenities({
  description,
  amenities,
  amenitiesGrouped = {},
}: RoomAmenitiesProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

  const displayedAmenities = amenities.slice(0, 10);

  return (
    <div className="py-6 space-y-8 border-b border-hairline-soft">
      {/* Description */}
      <div>
        <p
          className={`text-bodytext text-sm sm:text-base leading-relaxed whitespace-pre-line ${
            !isDescExpanded ? "line-clamp-4" : ""
          }`}
        >
          {description}
        </p>
        {description.length > 200 && (
          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-3 text-sm font-semibold text-ink underline flex items-center gap-1 hover:text-muted transition"
          >
            <span>{isDescExpanded ? "Show less" : "Show more"}</span>
            <span>{isDescExpanded ? "▴" : "›"}</span>
          </button>
        )}
      </div>

      <div className="h-px bg-hairline-soft" />

      {/* Amenities Section */}
      <div>
        <h3 className="text-xl font-bold text-ink mb-6">What this place offers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedAmenities.map((amenity) => {
            const icon = AMENITY_ICONS[amenity.icon_key] || "✓";
            return (
              <div key={amenity.id} className="flex items-center gap-4 text-sm text-ink">
                <span className="text-xl w-6 text-center">{icon}</span>
                <span>{amenity.name}</span>
              </div>
            );
          })}
        </div>

        {amenities.length > 10 && (
          <button
            onClick={() => setIsAmenitiesModalOpen(true)}
            className="mt-6 px-6 py-3 border border-ink rounded-xl text-sm font-semibold text-ink hover:bg-surface-soft transition"
          >
            Show all {amenities.length} amenities
          </button>
        )}
      </div>

      {/* All Amenities Modal */}
      {isAmenitiesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-hairline flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="relative flex items-center justify-center px-6 py-4 border-b border-hairline-soft">
              <button
                onClick={() => setIsAmenitiesModalOpen(false)}
                className="absolute left-6 p-1.5 rounded-full hover:bg-surface-soft transition text-ink"
                aria-label="Close"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
              <h2 className="text-base font-bold text-ink">What this place offers</h2>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.keys(amenitiesGrouped).length > 0 ? (
                Object.entries(amenitiesGrouped).map(([categoryName, items]) => (
                  <div key={categoryName} className="space-y-3">
                    <h4 className="font-bold text-base text-ink capitalize border-b border-hairline-soft pb-2">
                      {categoryName}
                    </h4>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 text-sm text-ink">
                          <span className="text-xl w-6 text-center">
                            {AMENITY_ICONS[item.icon_key] || "✓"}
                          </span>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  {amenities.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 text-sm text-ink">
                      <span className="text-xl w-6 text-center">
                        {AMENITY_ICONS[item.icon_key] || "✓"}
                      </span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
