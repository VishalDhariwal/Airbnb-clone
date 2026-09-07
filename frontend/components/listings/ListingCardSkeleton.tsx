import React from "react";

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-square w-full rounded-2xl bg-surface-strong mb-3" />
      <div className="flex items-center justify-between mb-1">
        <div className="h-4 bg-surface-strong rounded w-3/5" />
        <div className="h-4 bg-surface-strong rounded w-1/5" />
      </div>
      <div className="h-3 bg-surface-strong rounded w-2/5 mb-1" />
      <div className="h-3 bg-surface-strong rounded w-1/3 mb-2" />
      <div className="h-4 bg-surface-strong rounded w-1/4" />
    </div>
  );
}
