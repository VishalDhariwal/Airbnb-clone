"use client";

import React, { useState, useEffect } from "react";
import { HostListing } from "@/lib/types/host";
import { X, Loader2 } from "lucide-react";

interface HostEditModalProps {
  listing: HostListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<HostListing>) => Promise<void>;
}

export function HostEditModal({
  listing,
  isOpen,
  onClose,
  onSave,
}: HostEditModalProps) {
  const [title, setTitle] = useState("");
  const [pricePerNight, setPricePerNight] = useState<number>(1000);
  const [cleaningFee, setCleaningFee] = useState<number>(0);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [beds, setBeds] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listing) {
      setTitle(listing.title);
      setPricePerNight(listing.price_per_night);
      setCleaningFee(listing.cleaning_fee || 0);
      setMaxGuests(listing.max_guests);
      setBedrooms(listing.bedrooms);
      setBeds(listing.beds);
      setBathrooms(listing.bathrooms);
      setIsActive(listing.is_active);
      setError(null);
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    if (pricePerNight < 100) {
      setError("Price per night must be at least ₹100");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(listing.id, {
        title: title.trim(),
        price_per_night: Number(pricePerNight),
        cleaning_fee: Number(cleaningFee),
        max_guests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        is_active: isActive,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update listing";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-hairline overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Edit Listing</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:bg-surface-soft hover:text-ink transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-hairline focus:ring-2 focus:ring-ink focus:outline-none"
              required
            />
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Nightly Rate (₹)
              </label>
              <input
                type="number"
                min={100}
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-hairline focus:ring-2 focus:ring-ink focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Cleaning Fee (₹)
              </label>
              <input
                type="number"
                min={0}
                value={cleaningFee}
                onChange={(e) => setCleaningFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-hairline focus:ring-2 focus:ring-ink focus:outline-none"
              />
            </div>
          </div>

          {/* Capacity Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                Max Guests
              </label>
              <input
                type="number"
                min={1}
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-hairline"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-hairline"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                Beds
              </label>
              <input
                type="number"
                min={1}
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-hairline"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                step={0.5}
                min={0.5}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-hairline"
              />
            </div>
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active_check"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-rausch focus:ring-rausch"
            />
            <label
              htmlFor="is_active_check"
              className="text-xs font-medium text-ink cursor-pointer"
            >
              Listing is active and searchable for guests
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-hairline flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-soft rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-rausch hover:bg-rausch-hover rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
