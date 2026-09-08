"use client";

import React, { useState } from "react";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { calculateNights, fromISO, toISO, startOfToday } from "@/lib/dates";

/**
 * "Select dates in <city>" (reference 13, lower half). Same calendar component as
 * the reservation card and the search bar — one date picker in the whole app.
 */
export function RoomCalendarSection({ city }: { city: string }) {
  const [checkIn, setCheckIn] = useState(() => {
    const d = startOfToday();
    d.setDate(d.getDate() + 3);
    return toISO(d);
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = startOfToday();
    d.setDate(d.getDate() + 4);
    return toISO(d);
  });

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

  const rangeLabel = () => {
    const a = fromISO(checkIn);
    const b = fromISO(checkOut);
    if (!a || !b) return "Add your travel dates for exact pricing";
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return `${fmt(a)} – ${fmt(b)}`;
  };

  return (
    <div id="calendar-section" className="space-y-6 border-b border-hairline py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="t-display-md text-ink">
            {nights > 0 ? `${nights} ${nights === 1 ? "night" : "nights"} in ` : "Select dates in "}
            {city}
          </h3>
          <p className="mt-1 t-body-sm text-muted">{rangeLabel()}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCheckIn("");
            setCheckOut("");
          }}
          className="shrink-0 t-button-sm font-semibold text-ink underline underline-offset-2"
        >
          Clear dates
        </button>
      </div>

      <DateRangeCalendar
        checkIn={checkIn}
        checkOut={checkOut}
        months={2}
        onChange={(ci, co) => {
          setCheckIn(ci);
          setCheckOut(co);
        }}
        className="max-w-3xl"
      />
    </div>
  );
}
