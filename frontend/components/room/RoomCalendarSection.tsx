"use client";

import React, { useState } from "react";
import { Keyboard } from "lucide-react";

interface RoomCalendarSectionProps {
  city: string;
}

export function RoomCalendarSection({ city }: RoomCalendarSectionProps) {
  // Calendar days for September 2026 (starts on Tuesday)
  // Selected range: 18 - 19 September
  const [selectedStart, setSelectedStart] = useState<number | null>(18);
  const [selectedEnd, setSelectedEnd] = useState<number | null>(19);

  const daysSep = Array.from({ length: 30 }, (_, i) => i + 1);

  const clearDates = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  return (
    <div id="calendar-section" className="py-8 border-b border-hairline space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          {selectedStart && selectedEnd ? "1 night in " : "Select dates in "}
          {city}
        </h3>
        <p className="text-sm text-muted mt-1">
          {selectedStart && selectedEnd
            ? "18 Sep 2026 – 19 Sep 2026"
            : "Add your travel dates for exact pricing"}
        </p>
      </div>

      {/* Calendar Grid Container */}
      <div className="max-w-md">
        <div className="flex items-center justify-between font-semibold text-sm text-ink mb-4">
          <span>September 2026</span>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted mb-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {/* Sep 1 2026 is Tuesday, so 2 empty cells for Su, Mo */}
          <div />
          <div />
          {daysSep.map((day) => {
            const isStart = day === selectedStart;
            const isEnd = day === selectedEnd;
            const isSelected = isStart || isEnd;
            const isPast = day < 13;

            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  if (!selectedStart || (selectedStart && selectedEnd)) {
                    setSelectedStart(day);
                    setSelectedEnd(null);
                  } else {
                    setSelectedEnd(day);
                  }
                }}
                disabled={isPast}
                className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center font-medium transition ${
                  isPast
                    ? "text-muted/40 cursor-not-allowed line-through"
                    : isSelected
                    ? "bg-ink text-white font-bold"
                    : "hover:border hover:border-ink text-ink"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer bar of calendar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          className="p-2 text-ink hover:bg-surface-soft rounded-lg transition"
          aria-label="Keyboard shortcuts"
          onClick={() => {}}
        >
          <Keyboard className="w-5 h-5 text-ink" />
        </button>

        <button
          type="button"
          onClick={clearDates}
          className="text-xs font-semibold underline text-ink hover:text-muted transition p-1"
        >
          Clear dates
        </button>
      </div>
    </div>
  );
}
