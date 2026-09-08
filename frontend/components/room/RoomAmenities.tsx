"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { springFast, tapScaleSubtle } from "@/lib/motion";
import { Amenity } from "@/lib/types";

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
    <div id="amenities-section" className="py-6 space-y-8 border-b border-hairline-soft">
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
        <h3 className="mb-6 t-display-md text-ink">What this place offers</h3>
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
          <motion.button
            onClick={() => setIsAmenitiesModalOpen(true)}
            whileTap={tapScaleSubtle}
            transition={springFast}
            className="mt-6 rounded-sm border border-ink px-6 py-3 t-button-md font-semibold text-ink transition-colors duration-150 hover:bg-surface-soft"
          >
            Show all {amenities.length} amenities
          </motion.button>
        )}
      </div>

      <Modal
        isOpen={isAmenitiesModalOpen}
        onClose={() => setIsAmenitiesModalOpen(false)}
        title="What this place offers"
        size="md"
      >
        <div className="space-y-6 p-6">
          {Object.keys(amenitiesGrouped).length > 0
            ? Object.entries(amenitiesGrouped).map(([categoryName, items]) => (
                <div key={categoryName} className="space-y-3">
                  <h4 className="border-b border-hairline-soft pb-2 t-title-md capitalize text-ink">
                    {categoryName}
                  </h4>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 t-body-md text-ink">
                        <span className="w-6 text-center text-xl">
                          {AMENITY_ICONS[item.icon_key] || "\u2713"}
                        </span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : amenities.map((item) => (
                <div key={item.id} className="flex items-center gap-4 t-body-md text-ink">
                  <span className="w-6 text-center text-xl">
                    {AMENITY_ICONS[item.icon_key] || "\u2713"}
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
        </div>
      </Modal>
    </div>
  );
}
