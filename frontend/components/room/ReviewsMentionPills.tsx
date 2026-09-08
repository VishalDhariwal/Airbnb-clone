"use client";

import React, { useState } from "react";

const MENTION_CHIPS = [
  { id: "hospitality", label: "Hospitality", count: 12, icon: "🎁" },
  { id: "pool", label: "Pool", count: 2, icon: "🏝️" },
  { id: "comfort", label: "Comfort", count: 5, icon: "🛋️" },
  { id: "checkin", label: "Check-in", count: 3, icon: "🗄️" },
  { id: "cleanliness", label: "Cleanliness", count: 6, icon: "🧼" },
  { id: "location", label: "Location", count: 4, icon: "📍" },
  { id: "accuracy", label: "Accuracy", count: 3, icon: "🛡️" },
  { id: "value", label: "Value", count: 2, icon: "🏷️" },
];

export function ReviewsMentionPills() {
  const [selected, setSelected] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-bold text-ink">
        Guest reviews mention
      </h4>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MENTION_CHIPS.map((chip) => {
          const isActive = selected === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => toggle(chip.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition ${
                isActive
                  ? "bg-ink text-white border-ink"
                  : "bg-surface-soft/40 border-hairline text-ink hover:border-ink hover:bg-surface-soft"
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
              <span className={isActive ? "text-white/80" : "text-muted"}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
