"use client";

import React from "react";
import Link from "next/link";
import { AirbnbLogo } from "@/components/ui/Icons";
import { ChevronLeft, Loader2 } from "lucide-react";

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
          <div
            className="h-full bg-ink transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
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

            <button
              type="button"
              onClick={onNext}
              disabled={isNextDisabled || isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rausch hover:bg-rausch-hover text-white text-xs font-semibold shadow-sm transition disabled:opacity-40"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{nextLabel}</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
