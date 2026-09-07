"use client";

import React from "react";

interface DatePickerPopoverProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  onClose: () => void;
}

export function DatePickerPopover({
  checkIn,
  checkOut,
  onChange,
  onClose,
}: DatePickerPopoverProps) {
  // Quick presets helper
  function applyPreset(daysFromNow: number, stayDuration: number) {
    const start = new Date();
    start.setDate(start.getDate() + daysFromNow);
    const end = new Date(start);
    end.setDate(end.getDate() + stayDuration);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    onChange(startStr, endStr);
  }

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-full sm:w-[480px] bg-white rounded-3xl shadow-[0_6px_28px_rgba(0,0,0,0.16)] border border-hairline-soft p-6 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-hairline-soft">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Selected Dates</p>
          <p className="text-sm font-semibold text-ink mt-0.5">
            {checkIn ? `${checkIn} to ${checkOut || "..."}` : "Select travel dates"}
          </p>
        </div>
        {(checkIn || checkOut) && (
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="text-xs font-semibold text-muted underline hover:text-ink transition"
          >
            Clear dates
          </button>
        )}
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              const newCi = e.target.value;
              onChange(newCi, checkOut && checkOut > newCi ? checkOut : "");
            }}
            className="w-full px-3 py-2 border border-hairline rounded-xl text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => onChange(checkIn, e.target.value)}
            className="w-full px-3 py-2 border border-hairline rounded-xl text-sm text-ink outline-none focus:border-ink"
          />
        </div>
      </div>

      {/* Quick Travel Presets */}
      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Quick Presets</p>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => applyPreset(1, 2)}
          className="p-2.5 rounded-xl border border-hairline hover:border-ink text-xs font-medium text-ink transition text-center"
        >
          This Weekend
        </button>
        <button
          type="button"
          onClick={() => applyPreset(7, 7)}
          className="p-2.5 rounded-xl border border-hairline hover:border-ink text-xs font-medium text-ink transition text-center"
        >
          Next Week (7 days)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(14, 3)}
          className="p-2.5 rounded-xl border border-hairline hover:border-ink text-xs font-medium text-ink transition text-center"
        >
          In 2 Weeks
        </button>
      </div>

      <div className="mt-5 pt-3 border-t border-hairline-soft flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-ink text-white rounded-full text-xs font-semibold hover:opacity-90 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
