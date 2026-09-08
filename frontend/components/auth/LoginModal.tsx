"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Modal } from "@/components/ui/Modal";
import { AirbnbLogo } from "@/components/ui/Icons";
import { easeStandard, springFast, tapScaleSubtle } from "@/lib/motion";

export function LoginModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    demoLogin,
    demoUsers,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = authModalMode === "signup";

  function switchMode(newMode: "login" | "signup") {
    setError(null);
    setAuthModalMode(newMode);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (isSignUp) {
      const cleanName = name.trim();
      if (cleanName.length < 2) {
        setError("Please enter your full name (at least 2 characters).");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      setLoading(true);
      try {
        await signup({ name: cleanName, email: cleanEmail, password });
        setName("");
        setEmail("");
        setPassword("");
      } catch (err: any) {
        const msg = err?.detail || err?.message || "Failed to create account. Please try again.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await login(cleanEmail, password);
        setEmail("");
        setPassword("");
      } catch (err: any) {
        const msg = err?.detail || err?.message || "Invalid email or password.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleDemoLogin(demoEmail: string) {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(demoEmail);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Failed to authenticate demo user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      title={isSignUp ? "Sign up" : "Log in"}
      size="sm"
    >
      <div className="p-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <AirbnbLogo className="h-8 w-8 text-rausch" />
          <h3 className="t-display-lg text-ink font-semibold">
            {isSignUp ? "Create your account" : "Welcome back to Airbnb"}
          </h3>
          <p className="t-body-sm text-muted">
            {isSignUp
              ? "Join millions of travelers and hosts around the world."
              : "Log in to view bookings, wishlists, and manage your properties."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mb-6 flex rounded-xl bg-surface-soft p-1 border border-hairline">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-150 ${
              !isSignUp
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-150 ${
              isSignUp
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Error message banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: easeStandard }}
            className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs text-danger flex items-start gap-2"
            role="alert"
          >
            <span className="font-semibold text-danger shrink-0">⚠️</span>
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name field (Sign up only) */}
          {isSignUp && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1 block text-xs font-medium text-ink"
              >
                Full name
              </label>
              <div className="relative">
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-hairline-strong pl-10 pr-4 py-3 t-body-md text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
                />
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none" />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1 block text-xs font-medium text-ink"
            >
              Email address
            </label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-hairline-strong pl-10 pr-4 py-3 t-body-md text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="auth-password"
                className="text-xs font-medium text-ink"
              >
                Password
              </label>
              {isSignUp && (
                <span className="text-[11px] text-muted">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full rounded-xl border border-hairline-strong pl-10 pr-11 py-3 t-body-md text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 p-0.5 text-muted hover:text-ink transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {isSignUp && (
            <p className="text-[11px] text-muted leading-relaxed">
              By selecting <strong>Agree and continue</strong>, you agree to Airbnb&apos;s Terms of Service and acknowledge the Privacy Policy.
            </p>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={loading ? undefined : tapScaleSubtle}
            transition={springFast}
            className="h-12 w-full rounded-xl bg-rausch t-button-md font-semibold text-white transition-colors duration-150 hover:bg-rausch-active disabled:cursor-not-allowed disabled:bg-rausch-disabled mt-2"
          >
            {loading
              ? isSignUp
                ? "Creating account…"
                : "Logging in…"
              : isSignUp
              ? "Agree and continue"
              : "Log in"}
          </motion.button>
        </form>

        {/* Switch mode footer link */}
        <div className="mt-4 text-center">
          {isSignUp ? (
            <p className="text-xs text-muted">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-ink underline hover:text-rausch transition-colors"
              >
                Log in
              </button>
            </p>
          ) : (
            <p className="text-xs text-muted">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-ink underline hover:text-rausch transition-colors"
              >
                Sign up
              </button>
            </p>
          )}
        </div>

        <div className="relative my-5 flex items-center gap-4">
          <span className="h-px flex-1 bg-hairline" />
          <span className="t-caption-sm text-muted font-medium">or continue with demo access</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>

        {/* Pre-seeded persona switcher */}
        <div className="space-y-2">
          {demoUsers.slice(0, 3).map((du) => (
            <motion.button
              key={du.id}
              type="button"
              onClick={() => handleDemoLogin(du.email)}
              disabled={loading}
              whileTap={loading ? undefined : tapScaleSubtle}
              transition={springFast}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-hairline px-4 text-xs text-ink transition-colors duration-150 hover:bg-surface-soft hover:border-hairline-strong disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Continue as <strong className="font-semibold">{du.name}</strong>
                </span>
              </div>
              <span className="rounded-md bg-surface-soft px-2 py-0.5 text-[10px] font-semibold text-muted border border-hairline/60">
                {du.role_badge}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
