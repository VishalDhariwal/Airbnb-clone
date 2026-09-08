"use client";

import React from "react";
import { motion } from "framer-motion";
import { popoverVariants } from "@/lib/motion";
import { Navigation } from "lucide-react";

interface DestinationDropdownProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

const RECENT_SEARCH = {
  city: "Goa",
  details: "18–19 Sept · 2 guests",
};

const SUGGESTIONS = [
  {
    city: "Nearby",
    desc: "Find what's around you",
    isNearby: true,
    bgClass: "bg-blue-50 text-blue-600",
    icon: <Navigation className="w-5 h-5 fill-blue-600 text-blue-600 -rotate-45" />,
  },
  {
    city: "Noida, Uttar Pradesh",
    desc: "Near you",
    bgClass: "bg-pink-50 text-pink-600",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-current fill-none stroke-2" aria-hidden="true">
        <rect x="4" y="6" width="10" height="20" rx="1" />
        <rect x="18" y="12" width="10" height="14" rx="1" />
        <line x1="8" y1="10" x2="10" y2="10" />
        <line x1="8" y1="14" x2="10" y2="14" />
        <line x1="8" y1="18" x2="10" y2="18" />
        <line x1="22" y1="16" x2="24" y2="16" />
        <line x1="22" y1="20" x2="24" y2="20" />
      </svg>
    ),
  },
  {
    city: "Dehradun, Uttarakhand",
    desc: "For nature lovers",
    bgClass: "bg-emerald-50 text-emerald-600",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-current fill-none stroke-2" aria-hidden="true">
        <path d="M4 26L14 8l10 18H4z" />
        <path d="M16 26l6-10 6 10H16z" />
      </svg>
    ),
  },
  {
    city: "Gurgaon District, Haryana",
    desc: "Near you",
    bgClass: "bg-amber-50 text-amber-700",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-current fill-none stroke-2" aria-hidden="true">
        <rect x="4" y="10" width="16" height="16" rx="2" />
        <path d="M20 16c4 0 6 2 8 8M20 12c3-4 7-4 8-1" />
      </svg>
    ),
  },
  {
    city: "New Delhi, Delhi",
    desc: "Family-friendly",
    bgClass: "bg-teal-50 text-teal-700",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-current fill-none stroke-2" aria-hidden="true">
        <path d="M6 26V14l10-8 10 8v12H6z" />
        <rect x="12" y="18" width="8" height="8" />
      </svg>
    ),
  },
];

export function DestinationDropdown({ onChange, onClose }: DestinationDropdownProps) {
  return (
    <motion.div
      variants={popoverVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ originY: 0 }}

      onClick={(e) => e.stopPropagation()}
      className="absolute left-0 top-full mt-3 w-full sm:w-[440px] bg-white rounded-3xl shadow-card border border-hairline p-6 z-50"
    >
      {/* Recent Searches */}
      <div className="mb-5">
        <p className="text-xs font-bold text-ink mb-2.5">Recent searches</p>
        <button
          type="button"
          onClick={() => {
            onChange(RECENT_SEARCH.city);
            onClose();
          }}
          className="w-full flex items-center gap-4 p-2.5 rounded-2xl hover:bg-surface-soft transition text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-surface-soft flex items-center justify-center text-ink flex-shrink-0 group-hover:bg-white transition shadow-xs">
            <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-current fill-none stroke-[2]" aria-hidden="true">
              <path d="M16 2a9 9 0 0 0-9 9c0 7 9 17 9 17s9-10 9-17a9 9 0 0 0-9-9z" />
              <circle cx="16" cy="11" r="3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-ink leading-tight">{RECENT_SEARCH.city}</p>
            <p className="text-xs text-muted mt-0.5">{RECENT_SEARCH.details}</p>
          </div>
        </button>
      </div>

      {/* Suggested Destinations */}
      <div>
        <p className="text-xs font-bold text-ink mb-2.5">Suggested destinations</p>
        <div className="space-y-1">
          {SUGGESTIONS.map((item) => (
            <button
              key={item.city}
              type="button"
              onClick={() => {
                onChange(item.isNearby ? "Goa" : item.city.split(",")[0]);
                onClose();
              }}
              className={`w-full flex items-center gap-4 p-2.5 rounded-2xl transition text-left group ${
                item.isNearby ? "bg-surface-soft/80 hover:bg-surface-soft" : "hover:bg-surface-soft"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.bgClass} group-hover:scale-105 transition-transform`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-ink leading-tight">{item.city}</p>
                <p className="text-xs text-muted mt-0.5">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
