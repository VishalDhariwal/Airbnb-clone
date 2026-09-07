"use client";

import React, { useState } from "react";
import { HostListingCreateInput } from "@/lib/types/host";
import { ImagePlus, Trash2, CheckCircle2, Sparkles } from "lucide-react";

interface StepPhotosProps {
  data: HostListingCreateInput;
  onChange: (updates: Partial<HostListingCreateInput>) => void;
}

const PRESET_PHOTOS = [
  {
    title: "Goan Luxury Villa",
    url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Modern Living Area",
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sunlit Master Bedroom",
    url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Private Infinity Pool",
    url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Heritage Haveli Courtyard",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Himalayan Mountain Cottage",
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  },
];

export function StepPhotos({ data, onChange }: StepPhotosProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleAddUrl = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setUrlError("Please enter a valid image URL starting with http:// or https://");
      return;
    }
    setUrlError(null);
    if (!data.photo_urls.includes(trimmed)) {
      onChange({ photo_urls: [...data.photo_urls, trimmed] });
    }
    setInputUrl("");
  };

  const handleTogglePreset = (url: string) => {
    if (data.photo_urls.includes(url)) {
      onChange({ photo_urls: data.photo_urls.filter((u) => u !== url) });
    } else {
      onChange({ photo_urls: [...data.photo_urls, url] });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const next = [...data.photo_urls];
    next.splice(index, 1);
    onChange({ photo_urls: next });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl font-bold text-ink">Add photos of your place</h2>
        <p className="text-xs text-muted mt-1">
          Photos bring your space to life. You need at least 1 photo to publish (we recommend 5).
        </p>
      </div>

      {/* URL Input */}
      <div className="bg-white border border-hairline rounded-2xl p-4 space-y-3">
        <label className="block text-xs font-semibold text-ink">
          Add photo by Web URL (Unsplash, Cloudinary, etc.)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-hairline focus:ring-2 focus:ring-ink focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-ink hover:bg-black text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        {urlError && <p className="text-xs text-red-500">{urlError}</p>}
      </div>

      {/* Preset Library */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-rausch" />
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Or choose from ready-to-use sample photos
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_PHOTOS.map((preset) => {
            const isAdded = data.photo_urls.includes(preset.url);
            return (
              <button
                key={preset.url}
                type="button"
                onClick={() => handleTogglePreset(preset.url)}
                className={`group relative h-28 rounded-xl overflow-hidden border text-left transition ${
                  isAdded
                    ? "ring-2 ring-rausch border-rausch"
                    : "border-hairline hover:opacity-90"
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 flex flex-col justify-between">
                  <div className="flex justify-end">
                    {isAdded && (
                      <span className="bg-rausch text-white p-1 rounded-full shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-white truncate">
                    {preset.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Photos Gallery */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
          Selected Photos ({data.photo_urls.length})
        </h3>

        {data.photo_urls.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.photo_urls.map((url, idx) => (
              <div
                key={url + idx}
                className="relative group rounded-xl overflow-hidden border border-hairline h-36 bg-surface-soft shadow-sm"
              >
                <img
                  src={url}
                  alt={`Listing photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-ink/80 text-white text-[10px] font-semibold backdrop-blur-sm">
                    Cover Photo
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                  title="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-hairline rounded-2xl text-center">
            <p className="text-xs text-muted">
              No photos added yet. Select a sample photo above or paste a photo URL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
