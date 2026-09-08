"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DestinationDropdown } from "./DestinationDropdown";
import { DatePickerPopover } from "./DatePickerPopover";
import { GuestStepper } from "./GuestStepper";
import { useSearch } from "@/lib/hooks/useSearch";
import { formatRangeLabel } from "@/lib/dates";
import { SearchIcon } from "@/components/ui/Icons";
import { springFast, springMedium, fadeFast } from "@/lib/motion";

type ActivePanel = "where" | "when" | "who" | null;

interface SearchBarProps {
  /** Called after a search fires, so the navbar can collapse the bar. */
  onSubmitted?: () => void;
}

/**
 * The signature element (DESIGN_SYSTEM.md §7.2, reference 01).
 *
 * The behaviour people notice: when a segment is active the *bar* goes grey and the
 * active segment stays white and raised — the inverse of what you'd expect. The
 * white lozenge is animated with a shared `layoutId`, so it slides between segments
 * instead of blinking from one to the next.
 */
export function SearchBar({ onSubmitted }: SearchBarProps) {
  const { filters, executeSearch } = useSearch();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [hovered, setHovered] = useState<ActivePanel>(null);

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
    setLocation(filters.location);
    setCheckIn(filters.checkIn);
    setCheckOut(filters.checkOut);
    setGuests({
      adults: filters.adults || 1,
      children: filters.children || 0,
      infants: filters.infants || 0,
      pets: filters.pets || 0,
    });
  }, [filters]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActivePanel(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSearchClick(e?: React.SyntheticEvent) {
    if (e) e.stopPropagation();
    setActivePanel(null);
    executeSearch({ location: location.trim(), checkIn, checkOut, ...guests });
    onSubmitted?.();
  }

  const totalGuests = guests.adults + guests.children;
  const guestLabel =
    totalGuests > 1 ? `${totalGuests} guests` : totalGuests === 1 ? "1 guest" : "Add guests";
  const whenLabel = formatRangeLabel(checkIn, checkOut);

  const isOpen = activePanel !== null;
  /** Hide the divider that sits next to a lit-up segment. */
  const lit = activePanel ?? hovered;
  const showDivider1 = lit !== "where" && lit !== "when";
  const showDivider2 = lit !== "when" && lit !== "who";

  const segment = (id: Exclude<ActivePanel, null>) => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onClick: () => setActivePanel(id),
  });

  function segmentClass(id: Exclude<ActivePanel, null>, grow: string) {
    const isActive = activePanel === id;
    return `${grow} relative min-w-0 cursor-pointer rounded-full px-8 py-3.5 text-left ${
      !isActive && hovered === id ? "bg-black/[0.04]" : ""
    }`;
  }

  return (
    <div ref={barRef} className="relative mx-auto w-full max-w-[850px]">
      <motion.div
        className="flex h-[72px] items-center rounded-full border border-hairline"
        initial={false}
        animate={{ backgroundColor: isOpen ? "#EBEBEB" : "#FFFFFF" }}
        transition={fadeFast}
        style={{
          boxShadow:
            "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.10) 0 4px 8px 0",
        }}
      >
        {/* --- Where --- */}
        <div {...segment("where")} className={segmentClass("where", "flex-[1.15]")}>
          {activePanel === "where" && <ActiveLozenge />}
          <div className="relative">
            <label className="block cursor-pointer text-[12px] font-semibold text-ink">
              Where
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchClick(e);
                }
              }}
              placeholder="Search destinations"
              className="mt-0.5 w-full cursor-pointer truncate bg-transparent t-body-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <Divider show={showDivider1} />

        {/* --- When --- */}
        <div {...segment("when")} className={segmentClass("when", "flex-1")}>
          {activePanel === "when" && <ActiveLozenge />}
          <div className="relative">
            <label className="block cursor-pointer text-[12px] font-semibold text-ink">
              When
            </label>
            <span
              className={`mt-0.5 block truncate t-body-sm ${
                checkIn ? "text-ink" : "text-muted"
              }`}
            >
              {whenLabel}
            </span>
          </div>
        </div>

        <Divider show={showDivider2} />

        {/* --- Who + the orb --- */}
        <div
          {...segment("who")}
          className={`${segmentClass("who", "flex-[1.25]")} flex items-center gap-2 !py-2 !pr-2`}
        >
          {activePanel === "who" && <ActiveLozenge />}
          <div className="relative min-w-0 flex-1 py-1.5">
            <label className="block cursor-pointer text-[12px] font-semibold text-ink">
              Who
            </label>
            <span
              className={`mt-0.5 block truncate t-body-sm ${
                totalGuests > 1 ? "text-ink" : "text-muted"
              }`}
            >
              {guestLabel}
            </span>
          </div>

          {/* The orb widens into a labelled pill while a panel is open — reference 01 */}
          <motion.button
            type="button"
            onClick={handleSearchClick}
            aria-label="Search"
            layout
            transition={springMedium}
            whileTap={{ scale: 0.94 }}
            className="relative z-10 flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-rausch px-[14px] text-white transition-colors duration-150 hover:bg-rausch-active"
          >
            <SearchIcon className="h-4 w-4 shrink-0" />
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.span
                  key="label"
                  className="t-button-md overflow-hidden whitespace-nowrap font-semibold"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={springFast}
                >
                  Search
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* --- Panels --- */}
      <AnimatePresence>
        {activePanel === "where" && (
          <DestinationDropdown
            key="where"
            value={location}
            onChange={setLocation}
            onClose={() => setActivePanel("when")}
          />
        )}
        {activePanel === "when" && (
          <DatePickerPopover
            key="when"
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(ci, co) => {
              setCheckIn(ci);
              setCheckOut(co);
              if (ci && co) setActivePanel("who");
            }}
            onClose={() => setActivePanel("who")}
          />
        )}
        {activePanel === "who" && (
          <GuestStepper
            key="who"
            guests={guests}
            onChange={setGuests}
            onClose={() => setActivePanel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** The white raised pill behind the active segment. Slides between segments. */
function ActiveLozenge() {
  return (
    <motion.span
      layoutId="search-segment"
      transition={springMedium}
      className="absolute inset-0 rounded-full bg-white shadow-card"
    />
  );
}

function Divider({ show }: { show: boolean }) {
  return (
    <motion.span
      className="h-8 w-px shrink-0 bg-hairline"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={fadeFast}
    />
  );
}
