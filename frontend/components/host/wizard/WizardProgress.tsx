"use client";

import React from "react";
import Link from "next/link";
import { AirbnbLogo } from "@/components/ui/Icons";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { springTight, springFast, tapScaleSubtle } from "@/lib/motion";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
}

export function WizardProgress({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled = false,
  isSubmitting = false,
  nextLabel = "Next",
}: WizardProgressProps) {
  const percent = ((currentStep) / totalSteps) * 100;

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-hairline z-40 px-6 flex items-center justify-between">
        <Link href="/host" className="flex items-center gap-2">
          <AirbnbLogo className="w-8 h-8 text-rausch" />
          <span className="font-bold text-lg text-rausch">airbnb</span>
          <span className="text-xs font-semibold text-muted ml-2 px-2 py-0.5 bg-surface-soft rounded-full">
            Become a host
          </span>
        </Link>

        <Link
          href="/host"
          className="px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-soft rounded-full border border-hairline transition"
        >
          Exit wizard
        </Link>
      </header>

      {/* Bottom Sticky Progress Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-hairline z-40">
        {/* Visual Progress Line */}
        <div className="w-full h-1.5 bg-surface-soft">
          <motion.div
            className="h-full bg-ink"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={springTight}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={currentStep === 1 || isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline disabled:opacity-30 disabled:no-underline transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-muted hidden sm:inline">
              Step {currentStep} of {totalSteps}
            </span>

            <motion.button
              type="button"
              onClick={onNext}
              disabled={isNextDisabled || isSubmitting}
              whileTap={isNextDisabled || isSubmitting ? undefined : tapScaleSubtle}
              transition={springFast}
              className="inline-flex items-center gap-2 rounded-sm bg-rausch px-6 py-3 t-button-md font-semibold text-white transition-colors duration-150 hover:bg-rausch-active disabled:cursor-not-allowed disabled:bg-rausch-disabled"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{nextLabel}</span>
            </motion.button>
          </div>
        </div>
      </footer>
    </>
  );
}
