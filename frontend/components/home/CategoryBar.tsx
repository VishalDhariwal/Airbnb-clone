"use client";

import React, { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Category } from "@/lib/types";

// Category emoji icons matching seed data
const CATEGORY_EMOJIS: Record<string, string> = {
  "national-parks": "🌲",
  tropical: "🌴",
  "iconic-cities": "🏙️",
  cabins: "🛖",
  mansions: "🏰",
  "amazing-pools": "🏊",
  beachfront: "🏖️",
  farm: "🚜",
  lake: "⛵",
  "off-the-grid": "🏕️",
};

interface CategoryBarProps {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  onOpenFilters?: () => void;
}

export function CategoryBar({
  selectedCategory,
  onSelectCategory,
  onOpenFilters,
}: CategoryBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get<Category[]>("/metadata/categories")
      .then((data) => setCategories(data))
      .catch(() => {
        // Fallback default categories
        setCategories([
          { id: 1, name: "National parks", slug: "national-parks", icon_key: "tree" },
          { id: 2, name: "Tropical", slug: "tropical", icon_key: "palm" },
          { id: 3, name: "Iconic cities", slug: "iconic-cities", icon_key: "city" },
          { id: 4, name: "Cabins", slug: "cabins", icon_key: "cabin" },
          { id: 5, name: "Mansions", slug: "mansions", icon_key: "mansion" },
          { id: 6, name: "Amazing pools", slug: "amazing-pools", icon_key: "pool" },
          { id: 7, name: "Beachfront", slug: "beachfront", icon_key: "beach" },
          { id: 8, name: "Farm", slug: "farm", icon_key: "farm" },
          { id: 9, name: "Lake", slug: "lake", icon_key: "lake" },
          { id: 10, name: "Off-the-grid", slug: "off-the-grid", icon_key: "tent" },
        ]);
      });
  }, []);

  function scroll(direction: "left" | "right") {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  }

  return (
    <div className="w-full bg-white border-b border-hairline-soft sticky top-20 z-30">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 flex items-center gap-4 py-3">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-hairline hover:border-ink hover:shadow-sm text-ink transition flex-shrink-0"
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Horizontal Category Strip */}
        <div
          ref={scrollRef}
          className="flex items-center gap-8 overflow-x-auto scrollbar-none scroll-smooth flex-1 py-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const emoji = CATEGORY_EMOJIS[cat.slug] || "🏡";
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 transition group flex-shrink-0 ${
                  isSelected
                    ? "border-ink text-ink font-semibold"
                    : "border-transparent text-muted hover:text-ink hover:border-hairline"
                }`}
              >
                <span className="text-2xl group-hover:scale-105 transition-transform">{emoji}</span>
                <span className="text-xs whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-hairline hover:border-ink hover:shadow-sm text-ink transition flex-shrink-0"
          aria-label="Scroll right"
        >
          ›
        </button>

        {/* Filter Button */}
        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 border border-hairline rounded-xl px-4 py-2 text-xs font-semibold text-ink hover:border-ink hover:shadow-sm transition flex-shrink-0"
          >
            <span>Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
