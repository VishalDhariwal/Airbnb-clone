"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, Map } from "lucide-react";
import { springFast } from "@/lib/motion";

/** The floating list/map switch. Label crossfades so the pill doesn't jump width. */
export function MapListToggle({
  isMapMode,
  onToggle,
}: {
  isMapMode: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={springFast}
      className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-6 py-3.5 t-button-sm font-semibold text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] sm:bottom-8"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isMapMode ? "list" : "map"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2"
        >
          {isMapMode ? "Show list" : "Show map"}
          {isMapMode ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
