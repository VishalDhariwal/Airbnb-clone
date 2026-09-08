"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSearch } from "@/lib/hooks/useSearch";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { formatRangeLabel } from "@/lib/dates";
import { SearchIcon } from "@/components/ui/Icons";
import { sheetVariants, springFast, springMedium, tapScale } from "@/lib/motion";

type Step = "where" | "when" | "who";

const POPULAR = ["Goa", "Dehradun", "Jaipur", "Mumbai", "Bengaluru", "Manali"];

/**
 * Mobile full-screen search (reference 27). One accordion card per step: the open
 * card grows, the closed ones collapse to a summary row. Springs on the height so
 * the cards feel like they're being pushed apart rather than snapping.
 */
export function MobileSearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { filters, executeSearch } = useSearch();
  const [step, setStep] = useState<Step>("where");
  const [location, setLocation] = useState(filters.location);
  const [checkIn, setCheckIn] = useState(filters.checkIn);
  const [checkOut, setCheckOut] = useState(filters.checkOut);
  const [adults, setAdults] = useState(filters.adults || 1);
  const [children, setChildren] = useState(filters.children || 0);

  // Body scroll lock only. The step resets because Navbar remounts this component
  // each time it opens (via a changing key) — no setState inside an effect.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function submit() {
    executeSearch({ location: location.trim(), checkIn, checkOut, adults, children });
    onClose();
  }

  const totalGuests = adults + children;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={sheetVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[60] flex flex-col bg-surface-soft md:hidden"
        >
          <div className="flex items-center px-5 py-4">
            <motion.button
              type="button"
              onClick={onClose}
              whileTap={tapScale}
              transition={springFast}
              aria-label="Close search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
            <Card
              open={step === "where"}
              label="Where"
              summary={location || "I'm flexible"}
              onOpen={() => setStep("where")}
            >
              <p className="mb-3 t-display-sm text-ink">Where to?</p>
              <input
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search destinations"
                className="w-full rounded-xl border border-hairline px-4 py-3 t-body-md outline-none focus:border-ink"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {POPULAR.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setLocation(city);
                      setStep("when");
                    }}
                    className="rounded-full border border-hairline px-4 py-2 t-button-sm text-bodytext"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </Card>

            <Card
              open={step === "when"}
              label="When"
              summary={formatRangeLabel(checkIn, checkOut)}
              onOpen={() => setStep("when")}
            >
              <p className="mb-4 t-display-sm text-ink">When&rsquo;s your trip?</p>
              <DateRangeCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                months={1}
                onChange={(ci, co) => {
                  setCheckIn(ci);
                  setCheckOut(co);
                }}
              />
            </Card>

            <Card
              open={step === "who"}
              label="Who"
              summary={totalGuests > 1 ? `${totalGuests} guests` : "Add guests"}
              onOpen={() => setStep("who")}
            >
              <p className="mb-4 t-display-sm text-ink">Who&rsquo;s coming?</p>
              <Stepper label="Adults" sub="Ages 13 or above" value={adults} min={1} onChange={setAdults} />
              <Stepper label="Children" sub="Ages 2–12" value={children} min={0} onChange={setChildren} />
            </Card>
          </div>

          <div className="flex items-center justify-between border-t border-hairline bg-white px-5 py-4">
            <button
              type="button"
              onClick={() => {
                setLocation("");
                setCheckIn("");
                setCheckOut("");
              }}
              className="t-button-md font-semibold text-ink underline underline-offset-2"
            >
              Clear all
            </button>
            <motion.button
              type="button"
              onClick={submit}
              whileTap={{ scale: 0.97 }}
              transition={springFast}
              className="flex items-center gap-2 rounded-lg bg-rausch px-6 py-3.5 t-button-md font-semibold text-white"
            >
              <SearchIcon className="h-4 w-4" />
              Search
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Card({
  open,
  label,
  summary,
  onOpen,
  children,
}: {
  open: boolean;
  label: string;
  summary: string;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div layout transition={springMedium} className="overflow-hidden rounded-2xl bg-white shadow-card">
      {open ? (
        <motion.div layout className="p-5">
          {children}
        </motion.div>
      ) : (
        <motion.button
          layout
          type="button"
          onClick={onOpen}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <span className="t-button-sm text-muted">{label}</span>
          <span className="t-button-sm font-semibold text-ink">{summary}</span>
        </motion.button>
      )}
    </motion.div>
  );
}

function Stepper({
  label,
  sub,
  value,
  min,
  onChange,
}: {
  label: string;
  sub: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-hairline-soft py-4 last:border-0">
      <div>
        <p className="t-title-md text-ink">{label}</p>
        <p className="t-body-sm text-muted">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          whileTap={tapScale}
          transition={springFast}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline-strong text-ink disabled:opacity-40"
        >
          −
        </motion.button>
        <span className="w-5 text-center t-body-md tabular-nums">{value}</span>
        <motion.button
          type="button"
          whileTap={tapScale}
          transition={springFast}
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline-strong text-ink"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}
