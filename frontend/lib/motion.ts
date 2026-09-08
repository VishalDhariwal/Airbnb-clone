/**
 * lib/motion.ts — the motion contract (DESIGN_SYSTEM.md §11)
 *
 * Airbnb's web DLS drives almost everything off a small family of spring curves that
 * they ship as CSS `linear()` easings. Three durations, one shape. Everything that
 * moves in this app pulls from here — if you need a curve that isn't in this file,
 * stop and add it here rather than inlining a transition in a component.
 *
 * The rule of thumb from the live site:
 *   - things that CHANGE SIZE OR POSITION use a spring (search bar, modals, sheets)
 *   - things that only CHANGE COLOUR OR OPACITY use a short ease (hover, focus, fades)
 * Springs on colour look mushy; eases on movement look mechanical.
 */

import type { Transition, Variants } from "framer-motion";

/* ------------------------------------------------------------------ *
 * 1. Springs — the movement curves
 * ------------------------------------------------------------------ */

/** ~450ms settle. Dropdowns, popovers, hearts, small pills, hover lifts. */
export const springFast: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

/** ~600ms settle. Modals, the search bar expand/collapse, sheet transitions. */
export const springMedium: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 30,
  mass: 1,
};

/** ~800ms settle. Full-screen overlays, the map split, page-level layout shifts. */
export const springSlow: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 28,
  mass: 1.1,
};

/** No overshoot. For anything where a bounce would read as a bug — progress bars, height. */
export const springTight: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 40,
  mass: 1,
};

/* ------------------------------------------------------------------ *
 * 2. Eases — the non-movement curves
 * ------------------------------------------------------------------ */

/** Airbnb's standard curve. Fast out of the gate, long settle. */
export const easeStandard = [0.2, 0, 0, 1] as const;
/** Entering: decelerate into place. */
export const easeOut = [0, 0, 0.2, 1] as const;
/** Leaving: accelerate away. */
export const easeIn = [0.4, 0, 1, 1] as const;

export const durFast = 0.15; // hover, focus ring, colour swaps
export const durBase = 0.25; // fades, opacity crossfades
export const durSlow = 0.4; // image fade-in, scrim

export const fadeFast: Transition = { duration: durFast, ease: easeStandard };
export const fadeBase: Transition = { duration: durBase, ease: easeStandard };
export const fadeSlow: Transition = { duration: durSlow, ease: easeStandard };

/* ------------------------------------------------------------------ *
 * 3. Shared variants
 * ------------------------------------------------------------------ */

/** Modal backdrop. Plain fade — the scrim never moves. */
export const scrimVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: fadeBase },
  exit: { opacity: 0, transition: { duration: durFast, ease: easeIn } },
};

/** Centred modal panel: rises and scales in on a spring, drops out on an ease. */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springMedium },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: { duration: 0.18, ease: easeIn },
  },
};

/** Dropdown / popover anchored under a trigger. Origin should be set to top by the caller. */
export const popoverVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springFast },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -6,
    transition: { duration: 0.14, ease: easeIn },
  },
};

/** Mobile bottom sheet / full-screen search overlay. */
export const sheetVariants: Variants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: springMedium },
  exit: { y: "100%", transition: { duration: 0.24, ease: easeIn } },
};

/** Content that fades up as it mounts. Pair with staggerContainer for lists. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeStandard } },
};

/** Wrap a list in this to cascade its children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};

/** The heart. Squash then overshoot — the one place we allow a visible bounce. */
export const heartTap = {
  scale: [1, 0.82, 1.18, 1],
  transition: { duration: 0.45, times: [0, 0.25, 0.6, 1], ease: easeStandard },
};

/** Toast: slides up from the bottom edge. */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springFast },
  exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.2, ease: easeIn } },
};

/** Wizard / gallery step transitions. Direction is +1 forward, -1 back. */
export const slideVariants: Variants = {
  hidden: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  visible: { opacity: 1, x: 0, transition: springMedium },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -32 : 32,
    transition: { duration: 0.2, ease: easeIn },
  }),
};

/* ------------------------------------------------------------------ *
 * 4. Interaction presets
 * ------------------------------------------------------------------ */

/** Every pressable circular control on the site does this. */
export const tapScale = { scale: 0.92 };
export const tapScaleSubtle = { scale: 0.97 };

/** Card photo on hover — barely there, and that is the point. */
export const cardPhotoHover = { scale: 1.04, transition: { duration: 0.45, ease: easeStandard } };
