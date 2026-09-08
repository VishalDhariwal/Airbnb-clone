"use client";

import React from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { ShieldCheck, UserCheck, Sparkles, ArrowRight } from "lucide-react";

export function HostEmptyState() {
  const { login, openLoginModal } = useAuth();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-rausch bg-red-50 px-3 py-1 rounded-full">
          Airbnb your home
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          You could earn <span className="text-rausch">₹45,000</span> / month
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-xl mx-auto">
          Share your space in India. Whether you have a villa in Goa, a heritage haveli in Jaipur, or an apartment in Mumbai.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white border border-hairline rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-rausch mx-auto flex items-center justify-center mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-ink text-base">
            One-to-one guidance
          </h3>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            We will match you with a Superhost in your area to guide you from your first question to your first guest.
          </p>
        </div>

        <div className="bg-white border border-hairline rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-ink text-base">
            An experienced guest first
          </h3>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            For your first booking, you can choose to welcome an experienced guest who has at least three stays.
          </p>
        </div>

        <div className="bg-white border border-hairline rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-ink text-base">
            Specialised support
          </h3>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            Top-to-bottom protection. AirCover includes guest identity verification, reservation screening, and damage protection.
          </p>
        </div>
      </div>

      {/* 1-Click Host Switcher Card */}
      <div className="mt-12 bg-surface-soft border border-hairline rounded-3xl p-8 text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-ink">
          Test the Host Experience Right Now
        </h3>
        <p className="text-xs text-muted mt-1 max-w-md mx-auto">
          Switch to one of our pre-seeded verified host demo accounts with pre-loaded listings and active reservations:
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            onClick={() => login("priya.host@airbnb.test")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-rausch hover:bg-rausch-active text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Log in as Priya Sharma (Superhost)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => login("arjun.host@airbnb.test")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-gray-50 border border-hairline text-ink text-xs font-semibold shadow-sm transition"
          >
            <span>Log in as Arjun Mehta (Host)</span>
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={openLoginModal}
            className="text-xs font-semibold text-muted hover:text-ink underline transition"
          >
            Or sign up / log in with your own account
          </button>
        </div>
      </div>
    </div>
  );
}
