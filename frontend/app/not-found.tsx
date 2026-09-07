"use client";

import React from "react";
import Link from "next/link";
import { AirbnbLogo } from "@/components/ui/Icons";
import { Home, Compass, Luggage, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Animated Brand Badge */}
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-rausch mx-auto flex items-center justify-center shadow-sm">
          <AirbnbLogo className="w-9 h-9 text-rausch" />
        </div>

        {/* 404 Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight mt-1">
            We can&apos;t seem to find the page you&apos;re looking for
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-sm mx-auto">
            Here are some helpful links instead, or head back to the home page to start your search fresh.
          </p>
        </div>

        {/* Helpful Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/"
            className="p-4 rounded-2xl border border-hairline hover:border-ink bg-white shadow-sm flex flex-col items-center gap-2 transition group"
          >
            <Compass className="w-5 h-5 text-muted group-hover:text-ink transition" />
            <span className="text-xs font-semibold text-ink">Explore stays</span>
          </Link>

          <Link
            href="/trips"
            className="p-4 rounded-2xl border border-hairline hover:border-ink bg-white shadow-sm flex flex-col items-center gap-2 transition group"
          >
            <Luggage className="w-5 h-5 text-muted group-hover:text-ink transition" />
            <span className="text-xs font-semibold text-ink">Your trips</span>
          </Link>

          <Link
            href="/host"
            className="p-4 rounded-2xl border border-hairline hover:border-ink bg-white shadow-sm flex flex-col items-center gap-2 transition group"
          >
            <Home className="w-5 h-5 text-muted group-hover:text-ink transition" />
            <span className="text-xs font-semibold text-ink">Host home</span>
          </Link>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rausch hover:bg-rausch-hover text-white text-xs font-semibold shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
