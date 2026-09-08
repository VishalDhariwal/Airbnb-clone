"use client";

import React from "react";
import { motion } from "framer-motion";
import { popoverVariants } from "@/lib/motion";

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestStepperProps {
  guests: GuestCounts;
  onChange: (guests: GuestCounts) => void;
  onClose: () => void;
}

export function GuestStepper({ guests, onChange, onClose }: GuestStepperProps) {
  function update(key: keyof GuestCounts, delta: number) {
    const current = guests[key];
    const updated = Math.max(key === "adults" ? 1 : 0, current + delta);
    onChange({ ...guests, [key]: updated });
  }

  const rows = [
    { key: "adults" as const, title: "Adults", subtitle: "Ages 13 or above", min: 1 },
    { key: "children" as const, title: "Children", subtitle: "Ages 2–12", min: 0 },
    { key: "infants" as const, title: "Infants", subtitle: "Under 2", min: 0 },
    { key: "pets" as const, title: "Pets", subtitle: "Bringing a service animal?", min: 0 },
  ];

  return (
    <motion.div
      variants={popoverVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ originY: 0 }}
 className="absolute right-0 top-full mt-3 w-full sm:w-[380px] bg-white rounded-3xl shadow-card border border-hairline-soft p-6 z-50">
      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">{row.title}</p>
              <p className="text-xs text-muted">{row.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => update(row.key, -1)}
                disabled={guests[row.key] <= row.min}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-muted transition text-base font-medium"
              >
                -
              </button>
              <span className="w-5 text-center text-sm font-medium text-ink">
                {guests[row.key]}
              </span>
              <button
                type="button"
                onClick={() => update(row.key, 1)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink transition text-base font-medium"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-hairline-soft flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-ink text-white rounded-full text-xs font-semibold hover:opacity-90 transition"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}
