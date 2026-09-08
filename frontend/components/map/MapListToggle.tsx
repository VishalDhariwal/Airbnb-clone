"use client";

import React from "react";

interface MapListToggleProps {
  isMapMode: boolean;
  onToggle: () => void;
}

export function MapListToggle({ isMapMode, onToggle }: MapListToggleProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <button
        onClick={onToggle}
        className="bg-ink hover:bg-neutral-800 text-white py-3.5 px-6 rounded-full font-semibold text-sm shadow-[0_6px_20px_rgba(0,0,0,0.22)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-white/20"
      >
        <span>{isMapMode ? "Show list" : "Show map"}</span>
        <span className="text-base">{isMapMode ? "📋" : "🗺️"}</span>
      </button>
    </div>
  );
}
