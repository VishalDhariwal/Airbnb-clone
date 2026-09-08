"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { popoverVariants, springFast } from "@/lib/motion";
import { addMonths, toISO } from "@/lib/dates";

interface DatePickerPopoverProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  onClose: () => void;
}

const TABS = ["Dates", "Months", "Flexible"] as const;
const FLEX = ["Exact dates", "± 1 day", "± 2 days", "± 3 days", "± 7 days"];

export function DatePickerPopover({
  checkIn,
  checkOut,
  onChange,
  onClose,
}: DatePickerPopoverProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Dates");
  const [flex, setFlex] = useState(0);
  const [monthsAway, setMonthsAway] = useState(1);

  function applyMonths(n: number) {
    setMonthsAway(n);
    const start = addMonths(new Date(), 1);
    const end = addMonths(start, n);
    onChange(toISO(start), toISO(end));
  }

  return (
    <motion.div
      variants={popoverVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ originY: 0 }}
      className="absolute left-0 right-0 top-full z-50 mt-3 w-full rounded-[32px] border border-hairline-soft bg-white p-6 shadow-card"
    >
      {/* Dates / Months / Flexible */}
      <div className="mx-auto mb-6 flex w-fit items-center gap-1 rounded-full bg-surface-soft p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="relative rounded-full px-5 py-2.5 t-button-sm"
          >
            {tab === t && (
              <motion.span
                layoutId="datepicker-tab"
                transition={springFast}
                className="absolute inset-0 rounded-full bg-white shadow-card"
              />
            )}
            <span className={`relative ${tab === t ? "text-ink" : "text-muted"}`}>{t}</span>
          </button>
        ))}
      </div>

      {tab === "Dates" && (
        <>
          <DateRangeCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={onChange}
            months={2}
            className="px-2"
          />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {FLEX.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setFlex(i)}
                className={`rounded-full border px-4 py-2 t-button-sm transition-colors duration-150 ${flex === i
                    ? "border-ink bg-white text-ink"
                    : "border-hairline text-bodytext hover:border-ink"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {tab === "Months" && (
        <div className="flex flex-col items-center gap-6 py-6">
          <p className="t-display-sm text-ink">When&rsquo;s your trip?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => applyMonths(n)}
                className={`h-24 w-24 rounded-2xl border-2 transition-colors duration-150 ${monthsAway === n ? "border-ink" : "border-hairline hover:border-ink"
                  }`}
              >
                <span className="block t-display-sm text-ink">{n}</span>
                <span className="block t-body-sm text-muted">
                  {n === 1 ? "month" : "months"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "Flexible" && (
        <div className="flex flex-col items-center gap-5 py-8">
          <p className="t-display-sm text-ink">How long would you like to stay?</p>
          <div className="flex gap-3">
            {["Weekend", "Week", "Month"].map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-full border border-hairline px-5 py-2.5 t-button-sm text-bodytext transition-colors duration-150 hover:border-ink"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-hairline-soft pt-4">
        <button
          type="button"
          onClick={() => onChange("", "")}
          className="t-button-sm font-semibold text-ink underline underline-offset-2"
        >
          Clear dates
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-ink px-5 py-2.5 t-button-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
