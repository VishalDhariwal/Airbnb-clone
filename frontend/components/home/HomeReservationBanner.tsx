"use client";

import React from "react";
import Link from "next/link";

export function HomeReservationBanner() {
  return (
    <div className="flex justify-center my-4">
      <Link
        href="/rooms/1"
        className="bg-white border border-hairline rounded-2xl py-2 px-4 shadow-sm hover:shadow-md transition flex items-center gap-3.5 group"
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=150&q=80"
            alt="North Goa stay"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-semibold text-ink">
            Complete your North Goa home reservation
          </span>
          <span className="text-muted">18–19 Sept · 2 guests</span>
          <span className="text-ink font-bold group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </div>
      </Link>
    </div>
  );
}
