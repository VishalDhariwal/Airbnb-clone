"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "@/components/ui/Icons";
import { modalVariants, scrimVariants, springFast, tapScale } from "@/lib/motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Sticky footer — filters "Clear all / Show N places", wizard nav, etc. */
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  /** Full-bleed panels (photo gallery) skip the header hairline and padding. */
  bare?: boolean;
}

const SIZES = {
  sm: "max-w-[570px]",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  full: "max-w-none w-screen h-screen rounded-none",
};

/**
 * The one modal shell (DESIGN_SYSTEM.md §7.7). Scrim fades, panel springs up and
 * scales in, and leaves on a short ease — enter slow, exit fast, which is what
 * makes a modal feel responsive rather than sluggish.
 *
 * Also handles: body scroll lock, Escape to close, and click-outside.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  bare = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={scrimVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-md bg-white shadow-card ${SIZES[size]}`}
          >
            {!bare && (
              <div className="relative flex shrink-0 items-center justify-center border-b border-hairline-soft px-6 py-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  whileTap={tapScale}
                  transition={springFast}
                  className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-soft"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </motion.button>
                {title && <h2 className="t-title-md text-ink">{title}</h2>}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">{children}</div>

            {footer && (
              <div className="shrink-0 border-t border-hairline-soft bg-white px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
