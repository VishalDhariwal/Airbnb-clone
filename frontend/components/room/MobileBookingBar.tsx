"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import { StarIcon } from "@/components/ui/Icons";
import { springMedium, springFast, tapScaleSubtle } from "@/lib/motion";

/**
 * Mobile sticky price bar (reference 28). Slides up from the bottom edge once you
 * scroll past the photos, and sits above the tab bar's safe area.
 */
export function MobileBookingBar({
  nightlyRate,
  avgRating,
  reviewCount,
  onReserve,
}: {
  nightlyRate: number;
  avgRating: number;
  reviewCount: number;
  onReserve: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 320);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={springMedium}
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-hairline bg-white px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="min-w-0">
            <p className="truncate t-title-md text-ink">
              {formatCurrency(nightlyRate)}
              <span className="ml-1 t-body-sm font-normal text-muted">for 1 night</span>
            </p>
            {reviewCount > 0 && (
              <p className="mt-0.5 flex items-center gap-1 t-body-sm text-muted">
                <StarIcon className="h-3 w-3 text-ink" />
                <span className="text-ink">{avgRating.toFixed(2)}</span>
                <span>· {reviewCount} reviews</span>
              </p>
            )}
          </div>

          <motion.button
            type="button"
            onClick={onReserve}
            whileTap={tapScaleSubtle}
            transition={springFast}
            className="shrink-0 rounded-sm bg-rausch px-6 py-3 t-button-md font-semibold text-white transition-colors duration-150 hover:bg-rausch-active"
          >
            Reserve
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
