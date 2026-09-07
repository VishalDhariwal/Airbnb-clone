"use client";

import React from "react";

interface DestinationDropdownProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

const POPULAR_REGIONS = [
  { name: "I'm flexible", label: "Search all regions", icon: "🗺️" },
  { name: "Goa", label: "Beach & coastal villas", icon: "🏖️" },
  { name: "Manali", label: "Himalayan views & cabins", icon: "🏔️" },
  { name: "Mumbai", label: "City center apartments", icon: "🏙️" },
  { name: "Jaipur", label: "Heritage havelis & palaces", icon: "🏰" },
  { name: "Dehradun", label: "Valley stays & retreats", icon: "🌲" },
  { name: "Gurugram", label: "Modern tech hub suites", icon: "🏢" },
];

export function DestinationDropdown({ value, onChange, onClose }: DestinationDropdownProps) {
  return (
    <div className="absolute left-0 top-full mt-3 w-full sm:w-[420px] bg-white rounded-3xl shadow-[0_6px_28px_rgba(0,0,0,0.16)] border border-hairline-soft p-6 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
          Search by destination
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Where are you going? (e.g. Goa, Manali)"
          className="w-full px-4 py-2.5 rounded-xl border border-hairline focus:border-ink outline-none text-sm text-ink placeholder:text-muted"
          autoFocus
        />
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
        Popular destinations in India
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {POPULAR_REGIONS.map((region) => {
          const isSelected =
            (region.name === "I'm flexible" && !value) ||
            value.toLowerCase() === region.name.toLowerCase();
          return (
            <button
              key={region.name}
              type="button"
              onClick={() => {
                onChange(region.name === "I'm flexible" ? "" : region.name);
                onClose();
              }}
              className={`p-3 rounded-2xl border text-left transition flex flex-col items-start gap-1 ${
                isSelected
                  ? "border-ink bg-surface-soft font-semibold"
                  : "border-hairline hover:border-border-strong bg-white"
              }`}
            >
              <span className="text-2xl">{region.icon}</span>
              <span className="text-xs font-medium text-ink mt-1 truncate w-full">
                {region.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
