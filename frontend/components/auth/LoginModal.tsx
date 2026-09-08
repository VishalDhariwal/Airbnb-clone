"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { CloseIcon } from "@/components/ui/Icons";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, demoUsers } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isLoginModalOpen) {
        closeLoginModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim());
      setEmail("");
    } catch (err: any) {
      setError(err?.message || "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-hairline-soft overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 border-b border-hairline-soft">
          <button
            onClick={closeLoginModal}
            className="absolute left-6 p-1.5 rounded-full hover:bg-surface-soft transition text-ink"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-ink">Log in or sign up</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-ink mb-6">Welcome to Airbnb</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-muted mb-1">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-hairline rounded-lg text-ink placeholder:text-muted focus:outline-none focus:border-ink transition text-sm"
                required
              />
            </div>

            {error && <p className="text-xs text-danger font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-rausch to-rausch-active text-white rounded-lg font-semibold text-sm hover:opacity-95 disabled:opacity-50 transition shadow-sm"
            >
              {loading ? "Continuing..." : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline-soft" />
            </div>
            <span className="relative px-3 bg-white text-xs text-muted font-medium uppercase tracking-wider">
              or demo profiles
            </span>
          </div>

          {/* 1-Click Demo Logins */}
          <div className="space-y-2">
            {demoUsers.slice(0, 4).map((du) => (
              <button
                key={du.id}
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await login(du.email);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-2.5 px-4 border border-hairline rounded-lg text-xs font-medium text-ink hover:bg-surface-soft transition flex items-center justify-between"
              >
                <span>
                  Log in as <strong className="font-semibold">{du.name}</strong>
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    du.role_badge === "Superhost"
                      ? "bg-red-100 text-rausch"
                      : du.role_badge === "Host"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-muted"
                  }`}
                >
                  {du.role_badge}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-[11px] text-center text-muted">
            We will never send spam. Demo accounts are pre-seeded for easy evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
