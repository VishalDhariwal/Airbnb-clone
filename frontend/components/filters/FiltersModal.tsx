"use client";

import React, { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import {
  AMENITY_OPTIONS,
  COUNT_OPTIONS,
  FilterState,
  PROPERTY_TYPES,
  ROOM_TYPES,
} from "./types";

export type { FilterState };

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  resultCount?: number;
}

export function FiltersModal({
  isOpen,
  onClose,
  filters,
  onApply,
  resultCount,
}: FiltersModalProps) {
  const [draft, setDraft] = useState<FilterState>(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  function toggleAmenity(id: number) {
    setDraft((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(id)
        ? prev.amenityIds.filter((item) => item !== id)
        : [...prev.amenityIds, id],
    }));
  }

  function handleClear() {
    setDraft({ minPrice: null, maxPrice: null, roomType: null, propertyType: null, bedrooms: null, beds: null, bathrooms: null, amenityIds: [] });
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-hairline flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 border-b border-hairline-soft">
          <button
            onClick={onClose}
            className="absolute left-6 p-1.5 rounded-full hover:bg-surface-soft transition text-ink"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-ink">Filters</h2>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 divide-y divide-hairline-soft">
          {/* 1. Price Range */}
          <div>
            <h3 className="text-lg font-semibold text-ink mb-1">Price range</h3>
            <p className="text-xs text-muted mb-4">Nightly prices before taxes and fees</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-muted">₹</span>
                  <input
                    type="number"
                    value={draft.minPrice ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        minPrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="1,000"
                    className="w-full pl-7 pr-3 py-2.5 border border-hairline rounded-xl text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-muted">₹</span>
                  <input
                    type="number"
                    value={draft.maxPrice ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        maxPrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="50,000+"
                    className="w-full pl-7 pr-3 py-2.5 border border-hairline rounded-xl text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Type of place */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Type of place</h3>
            <div className="grid grid-cols-3 gap-3">
              {ROOM_TYPES.map((rt) => {
                const isSelected = draft.roomType === rt.value;
                return (
                  <button
                    key={rt.label}
                    type="button"
                    onClick={() => setDraft({ ...draft, roomType: rt.value })}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition ${
                      isSelected
                        ? "border-ink bg-surface-soft text-ink"
                        : "border-hairline hover:border-ink text-bodytext"
                    }`}
                  >
                    {rt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Property Type */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Property type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROPERTY_TYPES.map((pt) => {
                const isSelected = draft.propertyType === pt.value;
                return (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        propertyType: isSelected ? null : pt.value,
                      })
                    }
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition ${
                      isSelected
                        ? "border-ink bg-surface-soft text-ink"
                        : "border-hairline hover:border-ink text-bodytext"
                    }`}
                  >
                    {pt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Bedrooms & Beds */}
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-ink">Rooms and beds</h3>
            {[
              { title: "Bedrooms", key: "bedrooms" as const },
              { title: "Beds", key: "beds" as const },
            ].map((row) => (
              <div key={row.key}>
                <p className="text-sm font-medium text-ink mb-2">{row.title}</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {COUNT_OPTIONS.map((val) => (
                    <button
                      key={val ?? "any"}
                      type="button"
                      onClick={() => setDraft({ ...draft, [row.key]: val })}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold flex-shrink-0 transition ${
                        draft[row.key] === val
                          ? "bg-ink text-white border-ink"
                          : "border-hairline hover:border-ink text-ink"
                      }`}
                    >
                      {val === null ? "Any" : val === 8 ? "8+" : val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 5. Amenities */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const isChecked = draft.amenityIds.includes(amenity.id);
                return (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface-soft transition"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAmenity(amenity.id)}
                      className="w-4 h-4 rounded text-rausch accent-rausch cursor-pointer"
                    />
                    <span className="text-sm text-ink">{amenity.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-hairline-soft flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-ink underline hover:text-muted transition"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-3 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition"
          >
            {resultCount !== undefined ? `Show ${resultCount} places` : "Show places"}
          </button>
        </div>
      </div>
    </div>
  );
}
