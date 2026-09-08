"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";

interface StickyRoomNavProps {
  nightlyRate: number;
  avgRating: number;
  reviewCount: number;
  onReserve: () => void;
}

export function StickyRoomNav({
  nightlyRate,
  avgRating = 4.95,
  reviewCount = 22,
  onReserve,
}: StickyRoomNavProps) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("photos");

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav when scrolled past header & photos (~550px)
      if (window.scrollY > 550) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string, tab: string) => {
    setActiveTab(tab);
    if (tab === "photos") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  const originalPrice = Math.round(nightlyRate * 1.24);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-hairline shadow-sm transition-all duration-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 h-20 flex items-center justify-between">
        {/* Left Tabs */}
        <div className="flex items-center gap-6 text-sm font-semibold text-ink">
          <button
            type="button"
            onClick={() => scrollTo("room-header", "photos")}
            className={`py-6 transition border-b-2 ${
              activeTab === "photos" ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => scrollTo("amenities-section", "amenities")}
            className={`py-6 transition border-b-2 ${
              activeTab === "amenities" ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Amenities
          </button>
          <button
            type="button"
            onClick={() => scrollTo("reviews-section", "reviews")}
            className={`py-6 transition border-b-2 ${
              activeTab === "reviews" ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Reviews
          </button>
          <button
            type="button"
            onClick={() => scrollTo("reviews-section", "location")}
            className={`py-6 transition border-b-2 ${
              activeTab === "location" ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Location
          </button>
        </div>

        {/* Right Info & Reserve */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="line-through text-xs text-muted">
                {formatCurrency(originalPrice)}
              </span>
              <span className="font-bold text-base text-ink underline">
                {formatCurrency(nightlyRate)}
              </span>
              <span className="text-xs text-muted">for 1 night</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-xs font-semibold text-ink mt-0.5">
              <span>★</span>
              <span>{avgRating > 0 ? avgRating.toFixed(2) : "4.95"}</span>
              <span className="text-muted">·</span>
              <span className="text-muted font-normal underline">
                {reviewCount > 0 ? reviewCount : 22} reviews
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onReserve}
            className="px-6 py-3 bg-[#e01560] hover:bg-[#d70466] text-white rounded-xl font-semibold text-sm transition shadow-sm"
          >
            Reserve
          </button>
        </div>
      </div>
    </nav>
  );
}
