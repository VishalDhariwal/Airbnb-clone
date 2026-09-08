"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import { springFast, springMedium, tapScaleSubtle } from "@/lib/motion";
import { StarIcon } from "@/components/ui/Icons";

interface StickyRoomNavProps {
  nightlyRate: number;
  avgRating: number;
  reviewCount: number;
  onReserve: () => void;
}

const TABS = [
  { id: "photos", label: "Photos", target: "room-header" },
  { id: "amenities", label: "Amenities", target: "amenities-section" },
  { id: "reviews", label: "Reviews", target: "reviews-section" },
  { id: "location", label: "Location", target: "calendar-section" },
] as const;

/**
 * The sub-nav that drops in once you scroll past the photos (reference 13). It slides
 * down from -100% rather than fading, and the active underline is a shared layout
 * element so it slides between tabs.
 */
export function StickyRoomNav({
  nightlyRate,
  avgRating,
  reviewCount,
  onReserve,
}: StickyRoomNavProps) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("photos");

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 550);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollTo(target: string, id: string) {
    setActiveTab(id);
    if (id === "photos") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(target);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={springMedium}
          className="fixed left-0 right-0 top-0 z-40 border-b border-hairline bg-white"
        >
          <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-8 md:px-12">
            <div className="flex items-center gap-7">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollTo(tab.target, tab.id)}
                  className="relative py-7 t-button-sm font-semibold transition-colors duration-150"
                >
                  <span className={activeTab === tab.id ? "text-ink" : "text-muted hover:text-ink"}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="room-nav-underline"
                      transition={springFast}
                      className="absolute bottom-5 left-0 right-0 h-[2px] rounded-full bg-ink"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="t-title-md text-ink">{formatCurrency(nightlyRate)}</span>
                  <span className="t-body-sm text-muted">for 1 night</span>
                </div>
                <div className="mt-0.5 flex items-center justify-end gap-1 t-body-sm">
                  <StarIcon className="h-3 w-3 text-ink" />
                  <span className="text-ink">{avgRating > 0 ? avgRating.toFixed(2) : "New"}</span>
                  <span className="text-muted">·</span>
                  <span className="text-muted underline underline-offset-2">
                    {reviewCount} reviews
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={onReserve}
                whileTap={tapScaleSubtle}
                transition={springFast}
                className="rounded-lg bg-rausch px-6 py-3 t-button-md font-semibold text-white transition-colors duration-150 hover:bg-rausch-active"
              >
                Reserve
              </motion.button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
