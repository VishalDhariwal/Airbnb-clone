"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  fromISO,
  isSameDay,
  monthGrid,
  startOfToday,
  toISO,
} from "@/lib/dates";
import { easeStandard, springFast, tapScale } from "@/lib/motion";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

interface DateRangeCalendarProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  /** ISO dates that are already booked — rendered struck through and unclickable. */
  unavailable?: string[];
  /** 2 side-by-side months on desktop (search bar, reservation card) or 1 (mobile). */
  months?: 1 | 2;
  className?: string;
}

/**
 * The date picker (DESIGN_SYSTEM.md §7.6, reference 17).
 *
 * Day cells are 40px circles. Selected endpoints get an ink fill; the range between
 * them gets a --surface-soft lozenge that is drawn as a full-width background on the
 * cell wrapper, so it reads as one continuous bar rather than a row of separate pills.
 */
export function DateRangeCalendar({
  checkIn,
  checkOut,
  onChange,
  unavailable = [],
  months = 2,
  className = "",
}: DateRangeCalendarProps) {
  const today = startOfToday();
  const start = fromISO(checkIn);
  const end = fromISO(checkOut);

  const [cursor, setCursor] = useState(() => {
    const base = start ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState<Date | null>(null);

  const blocked = new Set(unavailable);
  const canGoBack =
    cursor.getFullYear() > today.getFullYear() ||
    (cursor.getFullYear() === today.getFullYear() && cursor.getMonth() > today.getMonth());

  function step(delta: number) {
    setDirection(delta);
    setCursor((c) => addMonths(c, delta));
  }

  function pick(day: Date) {
    const iso = toISO(day);
    // No start yet, or a complete range already — start over.
    if (!start || (start && end)) {
      onChange(iso, "");
      return;
    }
    // Clicking before the start moves the start.
    if (day.getTime() <= start.getTime()) {
      onChange(iso, "");
      return;
    }
    onChange(checkIn, iso);
  }

  /** The end of the range we should paint right now — real, or the one being hovered. */
  const previewEnd = end ?? (start && hovered && hovered > start ? hovered : null);

  function dayState(day: Date) {
    const isPast = day < today;
    const isBlocked = blocked.has(toISO(day));
    const disabled = isPast || isBlocked;
    const isStart = start ? isSameDay(day, start) : false;
    const isEnd = end ? isSameDay(day, end) : false;
    const inRange =
      !!start && !!previewEnd && day > start && day < previewEnd;
    return { disabled, isBlocked, isStart, isEnd, inRange };
  }

  return (
    <div className={className}>
      <div className="relative">
        {/* Month arrows sit above the grid, pinned to the outer edges */}
        <button
          type="button"
          onClick={() => canGoBack && step(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-soft disabled:cursor-not-allowed disabled:text-muted-soft disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next month"
          className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-soft"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${cursor.getFullYear()}-${cursor.getMonth()}`}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
              transition={{ duration: 0.22, ease: easeStandard }}
              className={`grid gap-x-10 ${months === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
            >
              {Array.from({ length: months }, (_, offset) => {
                const m = addMonths(cursor, offset);
                const cells = monthGrid(m.getFullYear(), m.getMonth());
                return (
                  <div key={offset} className={offset === 1 ? "hidden md:block" : ""}>
                    <p className="mb-4 text-center t-title-md text-ink">
                      {m.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                    </p>
                    <div className="mb-2 grid grid-cols-7">
                      {WEEKDAYS.map((d, i) => (
                        <span
                          key={i}
                          className="text-center text-[12px] font-medium text-muted"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7" onMouseLeave={() => setHovered(null)}>
                      {cells.map((day, i) => {
                        if (!day) return <span key={i} className="h-11" />;
                        const { disabled, isBlocked, isStart, isEnd, inRange } =
                          dayState(day);
                        return (
                          <div
                            key={i}
                            className={`relative flex h-11 items-center justify-center ${
                              inRange ? "bg-surface-soft" : ""
                            } ${isStart && previewEnd ? "rounded-l-full bg-surface-soft" : ""} ${
                              isEnd ? "rounded-r-full bg-surface-soft" : ""
                            }`}
                          >
                            <motion.button
                              type="button"
                              disabled={disabled}
                              onMouseEnter={() => setHovered(day)}
                              onClick={() => pick(day)}
                              whileTap={disabled ? undefined : tapScale}
                              transition={springFast}
                              aria-label={day.toDateString()}
                              aria-current={isStart || isEnd ? "date" : undefined}
                              className={`relative flex h-10 w-10 items-center justify-center rounded-full t-body-sm transition-colors duration-150
                                ${
                                  isStart || isEnd
                                    ? "bg-ink font-semibold text-white"
                                    : disabled
                                    ? "cursor-not-allowed text-muted-soft"
                                    : "text-ink hover:border hover:border-ink"
                                }`}
                            >
                              {day.getDate()}
                              {isBlocked && (
                                <span className="absolute left-1.5 right-1.5 h-px rotate-[-20deg] bg-muted-soft" />
                              )}
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
