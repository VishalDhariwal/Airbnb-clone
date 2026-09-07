"use client";

import dynamic from "next/dynamic";
import React from "react";

export const DynamicListingMap = dynamic(
  () => import("./ListingMap").then((mod) => mod.ListingMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] rounded-2xl bg-surface-soft flex items-center justify-center border border-hairline-soft">
        <div className="flex items-center gap-2 text-sm text-muted animate-pulse">
          <span className="text-xl">🗺️</span>
          <span>Loading interactive map...</span>
        </div>
      </div>
    ),
  }
);
