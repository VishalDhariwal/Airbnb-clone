"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { springFast, tapScaleSubtle } from "@/lib/motion";

export const QUICK_FILTERS = [
  "Free parking",
  "Wifi",
  "Free cancellation",
  "Guest favourite",
  "Air conditioning",
] as const;

export type QuickFilter = (typeof QUICK_FILTERS)[number];

/**
 * The strip under the nav on a results page (reference 10 / 12): a Filters button
 * followed by quick-toggle pills, centred. Selected pills invert to ink.
 */
export function SearchFilterStrip({
  active,
  onToggle,
  onOpenFilters,
  activeFilterCount = 0,
}: {
  active: QuickFilter[];
  onToggle: (f: QuickFilter) => void;
  onOpenFilters: () => void;
  activeFilterCount?: number;
}) {
  return (
    <div className="sticky top-20 z-30 border-b border-hairline-soft bg-white">
      <div className="scrollbar-none mx-auto flex max-w-[2520px] items-center justify-start gap-3 overflow-x-auto px-6 py-3 md:justify-center md:px-10 lg:px-20">
        <motion.button
          type="button"
          onClick={onOpenFilters}
          whileTap={tapScaleSubtle}
          transition={springFast}
          className="flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 t-button-sm text-ink transition-colors duration-150 hover:border-ink"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </motion.button>

        {QUICK_FILTERS.map((f) => {
          const on = active.includes(f);
          return (
            <motion.button
              key={f}
              type="button"
              onClick={() => onToggle(f)}
              aria-pressed={on}
              whileTap={tapScaleSubtle}
              transition={springFast}
              className={`shrink-0 rounded-full border px-4 py-2.5 t-button-sm transition-colors duration-150 ${
                on
                  ? "border-ink bg-ink text-white"
                  : "border-hairline bg-white text-ink hover:border-ink"
              }`}
            >
              {f}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
