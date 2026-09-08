"use client";

import { MotionConfig } from "framer-motion";
import React from "react";

/**
 * Wraps the app in framer-motion's config. `reducedMotion="user"` means every
 * transform/opacity animation in the tree collapses to an instant state change
 * when the OS has "Reduce motion" on — we get that for free instead of
 * hand-guarding each component.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
