"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { formatCancellationDate, formatCurrency } from "@/lib/format";
import { QuoteResponse } from "@/lib/types";
import { toISO, startOfToday, fromISO } from "@/lib/dates";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { GuestCounts, GuestPopover } from "./GuestPopover";
import { BookingPriceBreakdown } from "./BookingPriceBreakdown";
import { popoverVariants, springFast, tapScaleSubtle } from "@/lib/motion";

interface BookingWidgetProps {
  listingId: number;
  nightlyRate: number;
  cleaningFee: number;
  maxGuests: number;
  avgRating: number;
  reviewCount: number;
}

function plusDays(n: number) {
  const d = startOfToday();
  d.setDate(d.getDate() + n);
  return toISO(d);
}

/** The reservation card (DESIGN_SYSTEM.md §7.5/§7.6, references 16 and 17). */
export function BookingWidget({ listingId, nightlyRate, maxGuests }: BookingWidgetProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const [checkIn, setCheckIn] = useState(() => plusDays(3));
  const [checkOut, setCheckOut] = useState(() => plusDays(4));
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [openPanel, setOpenPanel] = useState<"dates" | "guests" | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const totalGuests = Math.max(1, guestCounts.adults + guestCounts.children);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenPanel(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setQuote(null);
      return;
    }
    let alive = true;
    setLoadingQuote(true);
    setQuoteError(null);

    api
      .post<QuoteResponse>(`/listings/${listingId}/quote`, {
        check_in: checkIn,
        check_out: checkOut,
        guests: totalGuests,
      })
      .then((data) => alive && setQuote(data))
      .catch((err) => {
        if (!alive) return;
        setQuote(null);
        setQuoteError(err instanceof Error ? err.message : "Selected dates unavailable");
      })
      .finally(() => alive && setLoadingQuote(false));

    return () => {
      alive = false;
    };
  }, [listingId, checkIn, checkOut, totalGuests]);

  function handleReserve() {
    if (!checkIn || !checkOut) return;
    router.push(
      `/book/${listingId}?check_in=${checkIn}&check_out=${checkOut}&guests=${totalGuests}`
    );
  }

  const isAvailable = quote ? quote.available : true;
  const stayNights = quote?.nights ?? 1;

  const dateLabel = (iso: string) => {
    const d = fromISO(iso);
    return d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "Add date";
  };

  return (
    <div ref={cardRef} className="sticky top-28 z-10">
      <div className="mb-4 flex items-center justify-center gap-2 rounded-md border border-hairline bg-white p-3.5 shadow-card">
        <span aria-hidden="true">🏷️</span>
        <span className="t-body-sm text-ink">Prices include all fees</span>
      </div>

      <div className="rounded-md border border-hairline bg-white p-6 shadow-card">
        <div className="mb-5 flex items-baseline gap-2">
          <span className="text-[22px] font-semibold text-ink">
            {formatCurrency(nightlyRate)}
          </span>
          <span className="t-body-md text-muted">
            for {stayNights} {stayNights === 1 ? "night" : "nights"}
          </span>
        </div>

        {/* Dates + guests box */}
        <div className="relative mb-3 rounded-sm border border-hairline-strong">
          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === "dates" ? null : "dates"))}
            className="grid w-full grid-cols-2 divide-x divide-hairline-strong border-b border-hairline-strong text-left"
          >
            <div className="rounded-tl-sm px-3 py-2.5 transition-colors duration-150 hover:bg-surface-soft">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-ink">
                Check-in
              </span>
              <span className="mt-0.5 block t-body-sm text-ink">{dateLabel(checkIn)}</span>
            </div>
            <div className="rounded-tr-sm px-3 py-2.5 transition-colors duration-150 hover:bg-surface-soft">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-ink">
                Checkout
              </span>
              <span className="mt-0.5 block t-body-sm text-ink">{dateLabel(checkOut)}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === "guests" ? null : "guests"))}
            className="flex w-full items-center justify-between rounded-b-sm px-3 py-2.5 text-left transition-colors duration-150 hover:bg-surface-soft"
          >
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-ink">
                Guests
              </span>
              <span className="mt-0.5 block t-body-sm text-ink">
                {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
                {guestCounts.infants > 0 &&
                  `, ${guestCounts.infants} infant${guestCounts.infants > 1 ? "s" : ""}`}
                {guestCounts.pets > 0 &&
                  `, ${guestCounts.pets} pet${guestCounts.pets > 1 ? "s" : ""}`}
              </span>
            </span>
            <motion.span
              animate={{ rotate: openPanel === "guests" ? 180 : 0 }}
              transition={springFast}
            >
              <ChevronDown className="h-4 w-4 text-ink" />
            </motion.span>
          </button>

          {/* Calendar popover — hangs off the left of the card so 2 months fit */}
          <AnimatePresence>
            {openPanel === "dates" && (
              <motion.div
                variants={popoverVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ originY: 0 }}
                className="absolute right-0 top-full z-50 mt-3 w-[calc(100vw-3rem)] max-w-[680px] rounded-md border border-hairline-soft bg-white p-6 shadow-card lg:w-[680px]"
              >
                <p className="mb-1 t-display-sm text-ink">
                  {stayNights} {stayNights === 1 ? "night" : "nights"}
                </p>
                <p className="mb-5 t-body-sm text-muted">
                  Add your travel dates for exact pricing
                </p>
                <DateRangeCalendar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  months={2}
                  onChange={(ci, co) => {
                    setCheckIn(ci);
                    setCheckOut(co);
                    if (ci && co) setOpenPanel(null);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <GuestPopover
            isOpen={openPanel === "guests"}
            onClose={() => setOpenPanel(null)}
            counts={guestCounts}
            onChange={setGuestCounts}
            maxGuests={maxGuests}
          />
        </div>

        <div className="my-3 rounded-sm bg-surface-strong px-3 py-2.5 text-center">
          <p className="t-body-sm text-ink">
            Free cancellation before{" "}
            <span className="font-semibold">{formatCancellationDate(checkIn)}</span>
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleReserve}
          disabled={loadingQuote || !isAvailable}
          whileTap={loadingQuote || !isAvailable ? undefined : tapScaleSubtle}
          transition={springFast}
          className="h-12 w-full rounded-sm bg-rausch t-button-md font-semibold text-white transition-colors duration-150 hover:bg-rausch-active disabled:cursor-not-allowed disabled:bg-rausch-disabled"
        >
          {loadingQuote ? "Checking dates…" : !isAvailable ? "Dates unavailable" : "Reserve"}
        </motion.button>

        <p className="mt-3 text-center t-body-sm text-muted">You won&apos;t be charged yet</p>

        {quoteError && (
          <p className="mt-2 text-center t-body-sm text-danger">{quoteError}</p>
        )}

        <AnimatePresence initial={false}>
          {quote && quote.available && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={springFast}
              className="overflow-hidden"
            >
              <BookingPriceBreakdown quote={quote} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          className="t-body-sm text-muted underline underline-offset-2 transition-colors duration-150 hover:text-ink"
        >
          Report this listing
        </button>
      </div>
    </div>
  );
}
