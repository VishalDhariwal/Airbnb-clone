"use client";

import React from "react";
import { HostListingCreateInput } from "@/lib/types/host";
import { MapPin, Navigation } from "lucide-react";

interface StepLocationProps {
  data: HostListingCreateInput;
  onChange: (updates: Partial<HostListingCreateInput>) => void;
}

const CITY_PRESETS = [
  { city: "Goa", state: "Goa", lat: 15.2993, lng: 74.124 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { city: "Manali", state: "Himachal Pradesh", lat: 32.2432, lng: 77.1892 },
  { city: "Udaipur", state: "Rajasthan", lat: 24.5854, lng: 73.7125 },
  { city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { city: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
  { city: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
];

export function StepLocation({ data, onChange }: StepLocationProps) {
  const handlePresetClick = (preset: typeof CITY_PRESETS[0]) => {
    onChange({
      city: preset.city,
      state: preset.state,
      latitude: preset.lat,
      longitude: preset.lng,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl font-bold text-ink">Where is your place located?</h2>
        <p className="text-xs text-muted mt-1">
          Your address is only shared with guests after they make a confirmed reservation.
        </p>
      </div>

      {/* Quick City Presets */}
      <div>
        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Popular Destinations (Click to autofill)
        </label>
        <div className="flex flex-wrap gap-2">
          {CITY_PRESETS.map((preset) => {
            const isSelected = data.city === preset.city;
            return (
              <button
                key={preset.city}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? "bg-ink text-white"
                    : "bg-surface-soft text-ink hover:bg-surface-strong border border-hairline"
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{preset.city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Address Form */}
      <div className="space-y-4 pt-2">
        {/* Street Address */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Street Address / House No.
          </label>
          <input
            type="text"
            placeholder="e.g. 14 Villa Marina, Vagator Beach Road"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline bg-white focus:ring-2 focus:ring-ink focus:outline-none"
            required
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">City</label>
            <input
              type="text"
              placeholder="e.g. Goa"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline bg-white focus:ring-2 focus:ring-ink focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">State</label>
            <input
              type="text"
              placeholder="e.g. Goa"
              value={data.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline bg-white focus:ring-2 focus:ring-ink focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">Country</label>
          <input
            type="text"
            value={data.country || "India"}
            onChange={(e) => onChange({ country: e.target.value })}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline bg-surface-soft text-ink focus:outline-none"
            readOnly
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-muted mb-1 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>Latitude</span>
            </label>
            <input
              type="number"
              step="0.0001"
              value={data.latitude}
              onChange={(e) => onChange({ latitude: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-hairline bg-white focus:ring-1 focus:ring-ink"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted mb-1 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>Longitude</span>
            </label>
            <input
              type="number"
              step="0.0001"
              value={data.longitude}
              onChange={(e) => onChange({ longitude: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-hairline bg-white focus:ring-1 focus:ring-ink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
