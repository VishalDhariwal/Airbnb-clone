"use client";

import React, { useMemo, useState } from "react";
import { HostListing, HostReservation } from "@/lib/types/host";
import { formatCurrency } from "@/lib/format";

export function HostToday({ listings, reservations }: { listings: HostListing[]; reservations: HostReservation[] }) {
  const [period, setPeriod] = useState<"today" | "upcoming">("today");
  const today = new Date().toISOString().slice(0, 10);
  const visibleReservations = useMemo(
    () => reservations.filter((reservation) => {
      if (reservation.status.toLowerCase() === "cancelled") return false;
      return period === "today"
        ? reservation.check_in <= today && reservation.check_out >= today
        : reservation.check_in > today;
    }),
    [period, reservations, today]
  );
  const hasPublishedListing = listings.some((listing) => listing.is_active);
  const listingHref = listings.length === 0 ? "/host/new" : "/host#listings";

  return (
    <main className="min-h-[calc(100vh-81px)] bg-white">
      <div className="mx-auto flex max-w-[760px] justify-center px-6 pt-10 sm:pt-12">
        <div className="inline-flex rounded-full bg-[#f2f2f2]">
          <PeriodButton active={period === "today"} onClick={() => setPeriod("today")}>Today</PeriodButton>
          <PeriodButton active={period === "upcoming"} onClick={() => setPeriod("upcoming")} wide>Upcoming</PeriodButton>
        </div>
      </div>

      {visibleReservations.length === 0 ? (
        <section className="mx-auto flex max-w-[560px] flex-col items-center px-6 pb-20 pt-[105px] text-center sm:pt-[118px]">
          <ReservationBookIllustration />
          <h1 className="mt-10 text-[34px] font-bold leading-[1.18] tracking-[-1.25px] text-[#181818] sm:text-[40px]">
            You don’t have<br />any reservations
          </h1>
          <p className="mt-6 max-w-[430px] text-[20px] leading-[1.35] tracking-[-0.25px] text-[#6a6a6a] sm:text-[22px]">
            {hasPublishedListing
              ? period === "today"
                ? "You have no guests arriving or staying today."
                : "New guest reservations will appear here when they’re booked."
              : "To get booked, you’ll need to complete and publish your listing."}
          </p>
          <a href={listingHref} className="mt-12 rounded-xl bg-[#f2f2f2] px-8 py-[18px] text-[17px] font-semibold text-[#222] transition hover:bg-[#e8e8e8]">
            {listings.length === 0 ? "Complete your listing" : "View your listings"}
          </a>
        </section>
      ) : (
        <section className="mx-auto max-w-[1040px] px-6 pb-20 pt-14 sm:px-10">
          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-ink">
            {period === "today" ? "Today’s reservations" : "Upcoming reservations"}
          </h1>
          <div className="divide-y divide-hairline rounded-2xl border border-hairline bg-white">
            {visibleReservations.map((reservation) => (
              <article key={reservation.id} className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4f5e8] font-semibold text-emerald-800">
                    {reservation.guest.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{reservation.guest.name}</p>
                    <p className="mt-1 text-sm text-muted">{reservation.listing_title}</p>
                    <p className="mt-1 text-xs text-muted">{reservation.check_in} – {reservation.check_out}</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="font-semibold text-ink">{formatCurrency(reservation.total_price)}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted">{reservation.status}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function PeriodButton({ active, wide = false, onClick, children }: { active: boolean; wide?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`${wide ? "min-w-[164px]" : "min-w-[142px]"} rounded-full px-8 py-[18px] text-[16px] font-semibold transition-all ${active ? "bg-[#3f3f3f] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)]" : "text-ink hover:bg-[#e9e9e9]"}`}>
      {children}
    </button>
  );
}

function ReservationBookIllustration() {
  return (
    <svg width="270" height="190" viewBox="0 0 270 190" fill="none" aria-hidden="true" className="drop-shadow-[0_13px_12px_rgba(0,0,0,0.10)]">
      <path d="M24 128 111 171l132-76-87-43L24 128Z" fill="#B88338" />
      <path d="m26 123 85 42 130-75-84-41L26 123Z" fill="#E5B569" />
      <path d="m28 117 84 41 126-72-82-40L28 117Z" fill="#F8F8F8" stroke="#D7D7D7" strokeWidth="2" />
      <path d="M112 158c6-39 5-81-2-126 25 11 45 11 64 3 4 41 25 56 64 51l-126 72Z" fill="#F3F3F3" stroke="#CFCFCF" strokeWidth="2" />
      <path d="M28 117c31-11 58-39 82-85 7 45 8 87 2 126l-84-41Z" fill="#FAFAFA" stroke="#CFCFCF" strokeWidth="2" />
      <path d="M110 32c-1 43 0 85 2 126" stroke="#BEBEBE" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((line) => <path key={`left-${line}`} d={`M48 ${103 - line * 9}c22-9 38-25 51-48`} stroke="#D9D9D9" strokeWidth="1.5" />)}
      {[0, 1, 2, 3].map((line) => <path key={`right-${line}`} d={`m130 ${135 - line * 18} 74-42`} stroke="#D2D2D2" strokeWidth="1.5" />)}
      <path d="m107 137-20 18 9-3 6 13 15-22-10-6Z" fill="#E61E4D" />
    </svg>
  );
}
