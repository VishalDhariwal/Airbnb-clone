"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { HostListing } from "@/lib/types/host";
import { useToast } from "@/lib/hooks/useToast";
import { CalendarDays, Loader2, Plus, X } from "lucide-react";

export function HostCalendar({ listings }: { listings: HostListing[] }) {
  const { showToast } = useToast();
  const [listingId, setListingId] = useState<number | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeListingId = listings.some((listing) => listing.id === listingId)
    ? listingId
    : listings[0]?.id ?? null;

  useEffect(() => {
    if (activeListingId === null) return;
    api
      .get<string[]>(`/host/listings/${activeListingId}/blocked-dates`)
      .then(setDates)
      .catch((error) => showToast(error instanceof Error ? error.message : "Could not load calendar", "error"))
      .finally(() => setLoading(false));
  }, [activeListingId, showToast]);

  function addDate() {
    if (!newDate || dates.includes(newDate)) return;
    setDates((current) => [...current, newDate].sort());
    setNewDate("");
  }

  async function saveCalendar() {
    if (activeListingId === null) return;
    try {
      setSaving(true);
      const saved = await api.put<string[]>(`/host/listings/${activeListingId}/blocked-dates`, { dates });
      setDates(saved);
      showToast("Availability saved", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save availability", "error");
    } finally {
      setSaving(false);
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-hairline bg-white px-6 py-16 text-center">
        <CalendarDays className="mx-auto h-10 w-10 text-muted" />
        <h2 className="mt-4 text-lg font-semibold text-ink">Create a listing to open your calendar</h2>
        <p className="mt-1 text-sm text-muted">Your availability is stored separately for each property.</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-hairline bg-white p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-bold text-ink">Availability calendar</h2>
          <p className="mt-1 text-sm text-muted">Block dates when guests should not be able to reserve your home.</p>
        </div>
        <label className="text-xs font-semibold text-ink">
          Listing
          <select
            value={activeListingId ?? ""}
            onChange={(event) => {
              setLoading(true);
              setListingId(Number(event.target.value));
            }}
            className="mt-1 block min-w-64 rounded-xl border border-hairline bg-white px-3 py-2 text-sm"
          >
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>{listing.title}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <input
          type="date"
          value={newDate}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(event) => setNewDate(event.target.value)}
          className="rounded-xl border border-hairline px-3 py-2.5 text-sm"
        />
        <button type="button" onClick={addDate} className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink px-4 py-2.5 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Block date
        </button>
      </div>

      <div className="mt-6 min-h-24 rounded-xl bg-surface-soft p-4">
        {loading ? (
          <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-rausch" />
        ) : dates.length ? (
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => (
              <span key={date} className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-3 py-2 text-xs font-medium">
                {new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                <button type="button" onClick={() => setDates((current) => current.filter((value) => value !== date))} aria-label={`Unblock ${date}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="py-7 text-center text-sm text-muted">No dates are blocked for this listing.</p>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button type="button" onClick={saveCalendar} disabled={loading || saving} className="inline-flex items-center gap-2 rounded-xl bg-rausch px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save availability
        </button>
      </div>
    </section>
  );
}
