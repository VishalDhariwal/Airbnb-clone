"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  counts: GuestCounts;
  onChange: (counts: GuestCounts) => void;
  maxGuests: number;
}

export function GuestPopover({
  isOpen,
  onClose,
  counts,
  onChange,
  maxGuests,
}: GuestPopoverProps) {
  if (!isOpen) return null;

  const totalGuests = counts.adults + counts.children;
  const canAddGuest = totalGuests < maxGuests;

  const update = (key: keyof GuestCounts, delta: number) => {
    if (delta > 0) {
      if ((key === "adults" || key === "children") && !canAddGuest) return;
      if (key === "infants" && counts.infants >= 5) return;
      if (key === "pets" && counts.pets >= 5) return;
    } else {
      if (key === "adults" && counts.adults <= 1) return;
      if (counts[key] <= 0) return;
    }
    onChange({ ...counts, [key]: counts[key] + delta });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.16)] border border-hairline p-5 z-30 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="space-y-4">
        {/* Row 1: Adults */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-ink">Adults</p>
            <p className="text-xs text-muted">Age 13+</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update("adults", -1)}
              disabled={counts.adults <= 1}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Decrease adults"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-normal text-ink">
              {counts.adults}
            </span>
            <button
              type="button"
              onClick={() => update("adults", 1)}
              disabled={!canAddGuest}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Increase adults"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Children */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-ink">Children</p>
            <p className="text-xs text-muted">Ages 2–12</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update("children", -1)}
              disabled={counts.children <= 0}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Decrease children"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-normal text-ink">
              {counts.children}
            </span>
            <button
              type="button"
              onClick={() => update("children", 1)}
              disabled={!canAddGuest}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Increase children"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 3: Infants */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-ink">Infants</p>
            <p className="text-xs text-muted">Under 2</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update("infants", -1)}
              disabled={counts.infants <= 0}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Decrease infants"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-normal text-ink">
              {counts.infants}
            </span>
            <button
              type="button"
              onClick={() => update("infants", 1)}
              disabled={counts.infants >= 5}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Increase infants"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 4: Pets */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-ink">Pets</p>
            <button
              type="button"
              onClick={() => {}}
              className="text-xs text-ink underline hover:text-muted transition block text-left"
            >
              Bringing a service animal?
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update("pets", -1)}
              disabled={counts.pets <= 0}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Decrease pets"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-normal text-ink">
              {counts.pets}
            </span>
            <button
              type="button"
              onClick={() => update("pets", 1)}
              disabled={counts.pets >= 5}
              className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30 disabled:hover:border-hairline transition"
              aria-label="Increase pets"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-muted leading-relaxed mt-4 pt-3 border-t border-hairline-soft">
        This place has a maximum of {maxGuests} guests, not including infants. If you&apos;re bringing more than 2 pets, please let your Host know.
      </p>

      {/* Close Button */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold underline text-ink hover:text-muted transition p-1"
        >
          Close
        </button>
      </div>
    </div>
  );
}
