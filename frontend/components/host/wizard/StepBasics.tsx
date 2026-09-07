"use client";

import React from "react";
import { HostListingCreateInput } from "@/lib/types/host";
import { Building2, Home, Castle, Trees, Warehouse, Waves, Sparkles, Minus, Plus } from "lucide-react";

interface StepBasicsProps {
  data: HostListingCreateInput;
  onChange: (updates: Partial<HostListingCreateInput>) => void;
}

const PROPERTY_TYPES = [
  { label: "Apartment", icon: Building2 },
  { label: "Villa", icon: Home },
  { label: "Heritage Home", icon: Castle },
  { label: "Cabin & Cottage", icon: Trees },
  { label: "Farmstay", icon: Warehouse },
  { label: "Beach House", icon: Waves },
  { label: "Luxury Suite", icon: Sparkles },
];

const ROOM_TYPES = [
  {
    type: "Entire place",
    desc: "Guests have the whole place to themselves.",
  },
  {
    type: "Private room",
    desc: "Guests have their own room, but some spaces may be shared.",
  },
  {
    type: "Shared room",
    desc: "Guests sleep in a room or common area shared with others.",
  },
];

export function StepBasics({ data, onChange }: StepBasicsProps) {
  const updateStepper = (field: "max_guests" | "bedrooms" | "beds" | "bathrooms", delta: number) => {
    const current = data[field];
    const minVal = field === "bedrooms" ? 0 : field === "bathrooms" ? 0.5 : 1;
    const stepVal = field === "bathrooms" ? 0.5 : 1;
    const next = Math.max(minVal, current + delta * stepVal);
    onChange({ [field]: next });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* 1. Property Type */}
      <div>
        <h2 className="text-xl font-bold text-ink">
          Which of these best describes your place?
        </h2>
        <p className="text-xs text-muted mt-1">
          Choose the property type that most closely fits your space.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {PROPERTY_TYPES.map((pt) => {
            const Icon = pt.icon;
            const isSelected = data.property_type === pt.label;
            return (
              <button
                key={pt.label}
                type="button"
                onClick={() => onChange({ property_type: pt.label })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition ${
                  isSelected
                    ? "border-ink bg-surface-soft ring-1 ring-ink"
                    : "border-hairline hover:border-ink bg-white"
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? "text-ink" : "text-muted"}`} />
                <span className="text-xs font-semibold text-ink">{pt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Room Type */}
      <div>
        <h2 className="text-xl font-bold text-ink">
          What type of place will guests have?
        </h2>
        <div className="space-y-3 mt-4">
          {ROOM_TYPES.map((rt) => {
            const isSelected = data.room_type === rt.type;
            return (
              <button
                key={rt.type}
                type="button"
                onClick={() => onChange({ room_type: rt.type })}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                  isSelected
                    ? "border-ink bg-surface-soft ring-1 ring-ink"
                    : "border-hairline hover:border-ink bg-white"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{rt.type}</p>
                  <p className="text-xs text-muted mt-0.5">{rt.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? "border-ink" : "border-hairline"
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-ink" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Steppers for Capacity */}
      <div>
        <h2 className="text-xl font-bold text-ink">
          Share some basics about your place
        </h2>
        <p className="text-xs text-muted mt-1">
          You will add more details, like bed types, later.
        </p>

        <div className="divide-y divide-hairline border-t border-b border-hairline mt-4">
          {/* Guests */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Guests</p>
              <p className="text-xs text-muted">Maximum number of guests</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateStepper("max_guests", -1)}
                disabled={data.max_guests <= 1}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-semibold text-sm">{data.max_guests}</span>
              <button
                type="button"
                onClick={() => updateStepper("max_guests", 1)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Bedrooms</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateStepper("bedrooms", -1)}
                disabled={data.bedrooms <= 0}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-semibold text-sm">{data.bedrooms}</span>
              <button
                type="button"
                onClick={() => updateStepper("bedrooms", 1)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Beds */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Beds</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateStepper("beds", -1)}
                disabled={data.beds <= 1}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-semibold text-sm">{data.beds}</span>
              <button
                type="button"
                onClick={() => updateStepper("beds", 1)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Bathrooms</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateStepper("bathrooms", -1)}
                disabled={data.bathrooms <= 0.5}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-semibold text-sm">{data.bathrooms}</span>
              <button
                type="button"
                onClick={() => updateStepper("bathrooms", 1)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center hover:border-ink"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
