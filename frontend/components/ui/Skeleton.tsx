"use client";

import React from "react";

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full animate-pulse">
      {/* Photo ratio placeholder */}
      <div className="aspect-[20/19] w-full rounded-2xl bg-surface-strong" />
      {/* Title line */}
      <div className="flex justify-between items-center mt-1">
        <div className="h-4 bg-surface-strong rounded-md w-3/5" />
        <div className="h-4 bg-surface-strong rounded-md w-1/8" />
      </div>
      {/* Distance / specs line */}
      <div className="h-3 bg-surface-soft rounded-md w-2/5" />
      {/* Date line */}
      <div className="h-3 bg-surface-soft rounded-md w-1/3" />
      {/* Price line */}
      <div className="h-4 bg-surface-strong rounded-md w-1/4 mt-1" />
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RoomDetailSkeleton() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-6 space-y-6 animate-pulse">
      {/* Title & header */}
      <div className="space-y-2">
        <div className="h-7 bg-surface-strong rounded-lg w-2/3" />
        <div className="h-4 bg-surface-soft rounded-md w-1/3" />
      </div>

      {/* Photo Mosaic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[360px] md:h-[440px]">
        <div className="md:col-span-2 h-full bg-surface-strong" />
        <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
          <div className="bg-surface-strong" />
          <div className="bg-surface-strong" />
          <div className="bg-surface-strong" />
          <div className="bg-surface-strong" />
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-6 bg-surface-strong rounded-md w-1/2" />
          <div className="h-4 bg-surface-soft rounded-md w-3/4" />
          <div className="h-24 bg-surface-soft rounded-xl" />
          <div className="h-32 bg-surface-soft rounded-xl" />
        </div>
        <div className="lg:col-span-5">
          <div className="h-96 bg-surface-strong rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export function TripCardSkeleton() {
  return (
    <div className="bg-white border border-hairline rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row animate-pulse">
      <div className="w-full md:w-56 h-48 md:h-auto bg-surface-strong" />
      <div className="p-5 flex-1 space-y-3">
        <div className="h-5 bg-surface-strong rounded-md w-2/3" />
        <div className="h-4 bg-surface-soft rounded-md w-1/2" />
        <div className="h-3 bg-surface-soft rounded-md w-1/3" />
        <div className="pt-4 border-t border-hairline flex justify-between">
          <div className="h-4 bg-surface-strong rounded w-20" />
          <div className="h-8 bg-surface-strong rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
}

export function HostDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface-strong rounded-2xl" />
        ))}
      </div>
      <div className="h-10 bg-surface-soft rounded-xl w-64" />
      <div className="space-y-4">
        <div className="h-44 bg-surface-strong rounded-2xl" />
        <div className="h-44 bg-surface-strong rounded-2xl" />
      </div>
    </div>
  );
}
