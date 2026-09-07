"use client";

import React, { useState, useEffect } from "react";
import { HostListingCreateInput } from "@/lib/types/host";
import { api } from "@/lib/api";
import { Wifi, Tv, Wind, Waves, Car, Utensils, Laptop, Sparkles } from "lucide-react";

interface StepAmenitiesProps {
  data: HostListingCreateInput;
  onChange: (updates: Partial<HostListingCreateInput>) => void;
}

interface CategoryItem {
  id: number;
  name: string;
}

interface AmenityItem {
  id: number;
  name: string;
}

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Amazing pools" },
  { id: 2, name: "Beachfront" },
  { id: 3, name: "Cabins" },
  { id: 4, name: "Iconic cities" },
  { id: 5, name: "Countryside" },
  { id: 6, name: "Heritage" },
  { id: 7, name: "Tropical" },
  { id: 8, name: "Lakefront" },
];

const DEFAULT_AMENITIES = [
  { id: 1, name: "Fast Wifi", icon: Wifi },
  { id: 2, name: "Air conditioning", icon: Wind },
  { id: 3, name: "Kitchen", icon: Utensils },
  { id: 4, name: "Dedicated workspace", icon: Laptop },
  { id: 5, name: "Free parking on premises", icon: Car },
  { id: 6, name: "Private outdoor pool", icon: Waves },
  { id: 7, name: "HD TV with Netflix", icon: Tv },
  { id: 8, name: "Luxury toiletries", icon: Sparkles },
];

export function StepAmenities({ data, onChange }: StepAmenitiesProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [amenities, setAmenities] = useState<AmenityItem[]>(DEFAULT_AMENITIES);

  useEffect(() => {
    // Fetch live categories and amenities if available
    api
      .get<CategoryItem[]>("/categories")
      .then((cats) => {
        if (cats && cats.length > 0) setCategories(cats);
      })
      .catch(() => {});

    api
      .get<AmenityItem[]>("/amenities")
      .then((ams) => {
        if (ams && ams.length > 0) setAmenities(ams);
      })
      .catch(() => {});
  }, []);

  const toggleCategory = (id: number) => {
    const current = data.category_ids || [];
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    onChange({ category_ids: next });
  };

  const toggleAmenity = (id: number) => {
    const current = data.amenity_ids || [];
    const next = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    onChange({ amenity_ids: next });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold text-ink">
          Choose categories that best describe your property
        </h2>
        <p className="text-xs text-muted mt-1">
          Guests can discover your property under these themes.
        </p>

        <div className="flex flex-wrap gap-2.5 mt-4">
          {categories.map((cat) => {
            const isSelected = (data.category_ids || []).includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  isSelected
                    ? "bg-ink text-white border-ink shadow-sm"
                    : "bg-white text-ink border-hairline hover:border-ink"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-xl font-bold text-ink">
          Tell guests what your place has to offer
        </h2>
        <p className="text-xs text-muted mt-1">
          You can add more amenities after you publish.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {amenities.map((amenity) => {
            const isSelected = (data.amenity_ids || []).includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition ${
                  isSelected
                    ? "border-ink bg-surface-soft ring-1 ring-ink"
                    : "border-hairline hover:border-ink bg-white"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Sparkles className={`w-4 h-4 ${isSelected ? "text-ink" : "text-muted"}`} />
                </div>
                <span className="text-xs font-semibold text-ink leading-tight">
                  {amenity.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
