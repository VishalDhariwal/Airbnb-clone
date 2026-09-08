"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { DestinationDropdown } from "./DestinationDropdown";
import { DatePickerPopover } from "./DatePickerPopover";
import { GuestStepper } from "./GuestStepper";
import { useSearch } from "@/lib/hooks/useSearch";

type ActivePanel = "where" | "when" | "who" | null;

function formatWhenLabel(checkIn: string, checkOut: string) {
  if (!checkIn && !checkOut) return "Add dates";
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const m1 = d1.toLocaleDateString("en-GB", { month: "short" });
    return `${d1.getDate()}–${d2.getDate()} ${m1}`;
  }
  return checkIn || "Add dates";
}

export function SearchBar() {
  const { filters, executeSearch } = useSearch();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const [location, setLocation] = useState(filters.location);
  const [checkIn, setCheckIn] = useState(filters.checkIn);
  const [checkOut, setCheckOut] = useState(filters.checkOut);
  const [guests, setGuests] = useState({
    adults: filters.adults || 1,
    children: filters.children || 0,
    infants: filters.infants || 0,
    pets: filters.pets || 0,
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
    executeSearch({
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

  const whenLabel = formatWhenLabel(checkIn, checkOut);

  return (
    <div ref={barRef} className="relative w-full max-w-[850px] mx-auto">
      {/* 3-Panel Main Bar: Where | When | Who */}
      <div
        className={`flex items-center rounded-full border border-hairline shadow-[0_3px_12px_rgba(0,0,0,0.08)] hover:shadow-md transition-all duration-300 bg-white ${
          activePanel ? "bg-[#f7f7f7]" : ""
        }`}
      >
        {/* 1. Where Panel */}
        <div
          onClick={() => setActivePanel("where")}
          className={`flex-1 min-w-0 py-3.5 px-8 rounded-full cursor-pointer transition-all duration-200 ${
            activePanel === "where"
              ? "bg-[#ebebeb] shadow-sm"
              : "hover:bg-[#ebebeb]/60"
          }`}
        >
          <label className="block text-xs font-bold text-ink cursor-pointer">
            Where
          </label>
          <input
            type="text"
            readOnly
            value={location || "Search destinations"}
            className={`w-full bg-transparent text-sm truncate outline-none cursor-pointer mt-0.5 ${
              location ? "text-ink font-semibold" : "text-muted"
            }`}
          />
        </div>

        {/* Divider 1 */}
        {activePanel !== "where" && activePanel !== "when" && (
          <div className="h-8 w-px bg-hairline" />
        )}

        {/* 2. When Panel */}
        <div
          onClick={() => setActivePanel("when")}
          className={`flex-1 min-w-0 py-3.5 px-8 rounded-full cursor-pointer transition-all duration-200 ${
            activePanel === "when"
              ? "bg-[#ebebeb] shadow-sm"
              : "hover:bg-[#ebebeb]/60"
          }`}
        >
          <label className="block text-xs font-bold text-ink cursor-pointer">
            When
          </label>
          <span
            className={`block text-sm truncate mt-0.5 ${
              checkIn ? "text-ink font-semibold" : "text-muted"
            }`}
          >
            {whenLabel}
          </span>
        </div>

        {/* Divider 2 */}
        {activePanel !== "when" && activePanel !== "who" && (
          <div className="h-8 w-px bg-hairline" />
        )}

        {/* 3. Who Panel with Search Button */}
        <div
          onClick={() => setActivePanel("who")}
          className={`flex-[1.1] min-w-0 py-2 pl-8 pr-2.5 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-between gap-2 ${
            activePanel === "who"
              ? "bg-[#ebebeb] shadow-sm"
              : "hover:bg-[#ebebeb]/60"
          }`}
        >
          <div className="min-w-0 flex-1">
            <label className="block text-xs font-bold text-ink cursor-pointer">
              Who
            </label>
            <span
              className={`block text-sm truncate mt-0.5 ${
                totalGuests > 0 ? "text-ink font-semibold" : "text-muted"
              }`}
            >
              {guestLabel}
            </span>
          </div>

          {/* Crimson Circular Search Action Button */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="w-12 h-12 rounded-full bg-[#e01560] hover:bg-[#d70466] text-white flex items-center justify-center transition flex-shrink-0 shadow-sm"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Popovers */}
      {activePanel === "where" && (
        <DestinationDropdown
          value={location}
          onChange={(loc) => setLocation(loc)}
          onClose={() => setActivePanel("when")}
        />
      )}

      {activePanel === "when" && (
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
          onChange={(newGuests) => setGuests(newGuests)}
          onClose={() => setActivePanel(null)}
        />
      )}
    </div>
  );
}
