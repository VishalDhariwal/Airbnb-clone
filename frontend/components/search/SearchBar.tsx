"use client";

import React, { useEffect, useRef, useState } from "react";
import { DestinationDropdown } from "./DestinationDropdown";
import { DatePickerPopover } from "./DatePickerPopover";
import { GuestStepper } from "./GuestStepper";
import { SearchIcon } from "@/components/ui/Icons";

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchBarProps {
  initialFilters?: Partial<SearchFilters>;
  onSearch: (filters: SearchFilters) => void;
}

type ActivePanel = "where" | "checkIn" | "checkOut" | "who" | null;

export function SearchBar({ initialFilters, onSearch }: SearchBarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [location, setLocation] = useState(initialFilters?.location || "");
  const [checkIn, setCheckIn] = useState(initialFilters?.checkIn || "");
  const [checkOut, setCheckOut] = useState(initialFilters?.checkOut || "");
  const [guests, setGuests] = useState({
    adults: initialFilters?.adults || 1,
    children: initialFilters?.children || 0,
    infants: initialFilters?.infants || 0,
    pets: initialFilters?.pets || 0,
  });

  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchClick(e: React.MouseEvent) {
    e.stopPropagation();
    setActivePanel(null);
    onSearch({
      location: location.trim(),
      checkIn,
      checkOut,
      ...guests,
    });
  }

  const totalGuests = guests.adults + guests.children;
  const guestLabel =
    totalGuests > 1
      ? `${totalGuests} guests`
      : totalGuests === 1
      ? "1 guest"
      : "Add guests";

  return (
    <div ref={barRef} className="relative w-full max-w-4xl mx-auto py-2">
      <div
        className={`flex items-center rounded-full border border-hairline transition-all duration-200 shadow-sm hover:shadow-md ${
          activePanel ? "bg-surface-soft border-hairline-soft" : "bg-white"
        }`}
      >
        {/* 1. Where Panel */}
        <div
          onClick={() => setActivePanel("where")}
          className={`flex-1 min-w-0 py-3.5 px-6 rounded-full cursor-pointer transition ${
            activePanel === "where" ? "bg-white shadow-lg" : "hover:bg-surface-soft"
          }`}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink">
            Where
          </label>
          <input
            type="text"
            readOnly
            value={location || "Search destinations"}
            className={`w-full bg-transparent text-sm truncate outline-none cursor-pointer ${
              location ? "text-ink font-semibold" : "text-muted"
            }`}
          />
        </div>

        <div className="h-8 w-px bg-hairline-soft" />

        {/* 2. Check in Panel */}
        <div
          onClick={() => setActivePanel("checkIn")}
          className={`flex-1 min-w-0 py-3.5 px-6 rounded-full cursor-pointer transition ${
            activePanel === "checkIn" || activePanel === "checkOut"
              ? "bg-white shadow-lg"
              : "hover:bg-surface-soft"
          }`}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink">
            Check in
          </label>
          <span
            className={`block text-sm truncate ${
              checkIn ? "text-ink font-semibold" : "text-muted"
            }`}
          >
            {checkIn || "Add dates"}
          </span>
        </div>

        <div className="h-8 w-px bg-hairline-soft" />

        {/* 3. Check out Panel */}
        <div
          onClick={() => setActivePanel("checkOut")}
          className={`flex-1 min-w-0 py-3.5 px-6 rounded-full cursor-pointer transition ${
            activePanel === "checkIn" || activePanel === "checkOut"
              ? "bg-white shadow-lg"
              : "hover:bg-surface-soft"
          }`}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink">
            Check out
          </label>
          <span
            className={`block text-sm truncate ${
              checkOut ? "text-ink font-semibold" : "text-muted"
            }`}
          >
            {checkOut || "Add dates"}
          </span>
        </div>

        <div className="h-8 w-px bg-hairline-soft" />

        {/* 4. Who Panel */}
        <div
          onClick={() => setActivePanel("who")}
          className={`flex-[1.2] min-w-0 py-3.5 pl-6 pr-3 rounded-full cursor-pointer transition flex items-center justify-between gap-2 ${
            activePanel === "who" ? "bg-white shadow-lg" : "hover:bg-surface-soft"
          }`}
        >
          <div className="min-w-0 flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink">
              Who
            </label>
            <span
              className={`block text-sm truncate ${
                totalGuests > 0 ? "text-ink font-semibold" : "text-muted"
              }`}
            >
              {guestLabel}
            </span>
          </div>

          {/* Search Action Button */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="p-3.5 bg-gradient-to-r from-rausch to-rausch-active hover:opacity-95 text-white rounded-full flex items-center gap-2 transition flex-shrink-0 shadow-sm"
            aria-label="Search"
          >
            <SearchIcon className="w-4 h-4" />
            <span className="hidden md:inline font-semibold text-xs pr-1">Search</span>
          </button>
        </div>
      </div>

      {/* Popovers */}
      {activePanel === "where" && (
        <DestinationDropdown
          value={location}
          onChange={(loc) => setLocation(loc)}
          onClose={() => setActivePanel("checkIn")}
        />
      )}

      {(activePanel === "checkIn" || activePanel === "checkOut") && (
        <DatePickerPopover
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={(ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
          }}
          onClose={() => setActivePanel("who")}
        />
      )}

      {activePanel === "who" && (
        <GuestStepper
          guests={guests}
          onChange={(g) => setGuests(g)}
          onClose={() => setActivePanel(null)}
        />
      )}
    </div>
  );
}
