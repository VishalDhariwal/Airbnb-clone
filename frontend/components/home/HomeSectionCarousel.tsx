"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomeSection } from "@/lib/types/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { easeStandard, springFast, tapScale } from "@/lib/motion";

/** Page gutters — kept identical to the navbar's so cards line up under the logo. */
export const PAGE_X = "px-6 md:px-10 lg:px-20";

export function HomeSectionCarousel({
  section,
  index = 0,
}: {
  section: HomeSection;
  index?: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hasMoved, setHasMoved] = useState(false);

  function move(direction: -1 | 1) {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth * 0.82, behavior: "smooth" });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: easeStandard, delay: Math.min(index, 3) * 0.05 }}
      className="mx-auto max-w-[2520px] px-6 md:px-10 lg:px-20"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => move(1)}
          className="group flex min-w-0 items-center gap-2 text-left"
        >
          <h2 className="truncate text-[22px] font-bold leading-[1.3] tracking-[-0.4px] text-ink">
            {section.title}
          </h2>
          <motion.span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-soft"
            whileHover={{ x: 2 }}
            transition={springFast}
          >
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </motion.span>
        </button>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <CarouselArrow
            dir="left"
            disabled={!hasMoved}
            onClick={() => move(-1)}
            label={`Previous ${section.title}`}
          />
          <CarouselArrow dir="right" onClick={() => move(1)} label={`Next ${section.title}`} />
        </div>
      </div>

      <div
        ref={rowRef}
        onScroll={(event) => setHasMoved(event.currentTarget.scrollLeft > 8)}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth"
      >
        {section.items.map((listing, i) => (
          <div
            key={listing.id}
            className="shrink-0 snap-start w-[calc((100%-16px)/2)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/6)]"
          >
            <ListingCard listing={listing} priority={index === 0 && i < 6} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function CarouselArrow({
  dir,
  disabled = false,
  onClick,
  label,
}: {
  dir: "left" | "right";
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : tapScale}
      transition={springFast}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-white text-ink transition-colors duration-150 hover:bg-surface-soft disabled:cursor-not-allowed disabled:text-muted-soft disabled:hover:bg-white"
    >
      <Icon className="h-4 w-4" strokeWidth={2.2} />
    </motion.button>
  );
}
