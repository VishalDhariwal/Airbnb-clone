"use client";

import React from "react";
import { HostListingCreateInput } from "@/lib/types/host";
import { formatCurrency } from "@/lib/format";
import { Star, Eye } from "lucide-react";

interface StepPricingProps {
  data: HostListingCreateInput;
  onChange: (updates: Partial<HostListingCreateInput>) => void;
}

export function StepPricing({ data, onChange }: StepPricingProps) {
  const defaultPhoto =
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
  const previewPhoto = data.photo_urls[0] || defaultPhoto;

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-xl font-bold text-ink">
          Give your place a title, description & set your price
        </h2>
        <p className="text-xs text-muted mt-1">
          Catchy titles and transparent pricing help your listing attract guests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Listing Title
            </label>
            <input
              type="text"
              placeholder="e.g. Luxurious Sea-Facing Villa with Infinity Pool"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              maxLength={70}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline bg-white focus:ring-2 focus:ring-ink focus:outline-none"
              required
            />
            <div className="flex justify-between text-[11px] text-muted mt-1">
              <span>Short, catchy titles work best</span>
              <span>{data.title.length}/70</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Tell guests about your place, what makes it special, and the surrounding neighborhood..."
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline bg-white focus:ring-2 focus:ring-ink focus:outline-none resize-none"
              required
            />
            <p className="text-[11px] text-muted mt-1">
              Minimum 10 characters required.
            </p>
          </div>

          {/* Pricing Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Nightly Price (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  step={100}
                  placeholder="2500"
                  value={data.price_per_night || ""}
                  onChange={(e) =>
                    onChange({ price_per_night: parseInt(e.target.value) || 0 })
                  }
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-hairline bg-white focus:ring-2 focus:ring-ink focus:outline-none"
                  required
                />
              </div>
              <p className="text-[11px] text-muted mt-1">Base rate per night</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Cleaning Fee (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  placeholder="500"
                  value={data.cleaning_fee || 0}
                  onChange={(e) =>
                    onChange({ cleaning_fee: parseInt(e.target.value) || 0 })
                  }
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-hairline bg-white focus:ring-2 focus:ring-ink focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-muted mt-1">One-time per stay</p>
            </div>
          </div>
        </div>

        {/* Right Live Preview (5 cols) */}
        <div className="lg:col-span-5 bg-surface-soft border border-hairline rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-muted text-xs font-bold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>Search Card Preview</span>
          </div>

          {/* Listing Card Preview */}
          <div className="bg-white rounded-2xl overflow-hidden border border-hairline shadow-md">
            <div className="relative aspect-[20/19] w-full bg-surface-strong">
              <img
                src={previewPhoto}
                alt="Listing preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-white/90 text-ink text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                Guest favourite
              </span>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink truncate">
                  {data.city ? `${data.city}, India` : "Goa, India"}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-ink text-ink" />
                  <span>New</span>
                </div>
              </div>
              <p className="text-xs text-muted truncate">
                {data.title || "Your amazing listing title"}
              </p>
              <p className="text-xs text-muted">
                {data.property_type} • {data.max_guests} guests
              </p>
              <div className="pt-2 text-sm">
                <span className="font-bold text-ink">
                  {formatCurrency(data.price_per_night || 0)}
                </span>{" "}
                <span className="text-xs text-muted">night</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
