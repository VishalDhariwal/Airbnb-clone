"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { popoverVariants } from "@/lib/motion";
import Link from "next/link";
import {
  Heart,
  Briefcase,
  MessageSquare,
  User as UserIcon,
  Bell,
  Settings,
  Globe,
  HelpCircle,
  Home,
  LogOut,
  Sparkles,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountMenu({ isOpen, onClose }: AccountMenuProps) {
  const {
    user,
    logout,
    demoUsers,
    demoLogin,
    openLoginModal,
    openSignupModal,
    currentRole,
    switchRole,
    becomeHost,
  } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const isCurrentHost = currentRole === "host" || (user?.is_host && currentRole !== "traveller");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          variants={popoverVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ originX: 1, originY: 0 }}
          className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-hairline-soft bg-white py-2 text-ink shadow-[0_6px_20px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          {user ? (
            /* ================= LOGGED IN STATE ================= */
            <>
              {/* User profile card */}
              <div className="px-5 py-3.5 bg-surface-soft/50 border-b border-hairline/60">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-hairline shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-rausch text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {isCurrentHost ? (
                        user.is_superhost ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rausch bg-rausch/10 px-2 py-0.5 rounded-full border border-rausch/20">
                            <Sparkles className="w-2.5 h-2.5" /> Superhost
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink bg-surface-strong px-2 py-0.5 rounded-full border border-hairline">
                            <ShieldCheck className="w-2.5 h-2.5 text-rausch" /> Active Host
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted bg-surface-soft px-2 py-0.5 rounded-full border border-hairline">
                          Active Traveller
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role Switcher if user has both roles */}
                {user.is_host ? (
                  <div className="mt-3 pt-2.5 border-t border-hairline/50">
                    <button
                      type="button"
                      onClick={async () => {
                        const target = isCurrentHost ? "traveller" : "host";
                        await switchRole(target);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-hairline hover:border-ink/40 text-xs font-medium text-ink shadow-xs transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-rausch" />
                        <span>Switch to {isCurrentHost ? "Travelling" : "Hosting"}</span>
                      </span>
                      <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                        RBAC
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 pt-2.5 border-t border-hairline/50">
                    <button
                      type="button"
                      onClick={async () => {
                        await becomeHost();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-rausch/10 hover:bg-rausch/15 text-rausch text-xs font-semibold transition"
                    >
                      <span>Become a Host</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="py-1.5">
                <Link
                  href="/trips"
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-5 py-2 text-sm hover:bg-surface-soft transition"
                >
                  <MessageSquare className="w-4 h-4 text-ink" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="/trips"
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-5 py-2 text-sm hover:bg-surface-soft transition"
                >
                  <Briefcase className="w-4 h-4 text-ink" />
                  <span>Trips</span>
                </Link>
                <Link
                  href="/wishlists"
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-5 py-2 text-sm hover:bg-surface-soft transition"
                >
                  <Heart className="w-4 h-4 text-ink" />
                  <span>Wishlists</span>
                </Link>
              </div>

              <div className="h-px bg-hairline my-1" />

              {/* Host & Account Management */}
              <div className="py-1.5">
                <Link
                  href="/host"
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-5 py-2 text-sm hover:bg-surface-soft transition font-medium"
                >
                  <Home className="w-4 h-4 text-ink" />
                  <span>{user.is_host ? "Manage listings" : "Airbnb your home"}</span>
                </Link>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-5 py-2 text-sm hover:bg-surface-soft transition"
                >
                  <Settings className="w-4 h-4 text-ink" />
                  <span>Account settings</span>
                </Link>
              </div>
            </>
          ) : (
            /* ================= LOGGED OUT STATE ================= */
            <>
              <div className="py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openSignupModal();
                  }}
                  className="w-full text-left px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-soft transition flex items-center justify-between"
                >
                  <span>Sign up</span>
                  <span className="text-[11px] font-normal text-muted bg-surface-soft px-2 py-0.5 rounded-full border border-hairline">
                    Create account
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openLoginModal();
                  }}
                  className="w-full text-left px-5 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
                >
                  Log in
                </button>
              </div>

              <div className="h-px bg-hairline my-1" />

              <div className="py-1.5">
                <Link
                  href="/host"
                  onClick={onClose}
                  className="block px-5 py-2 text-sm hover:bg-surface-soft transition text-ink"
                >
                  Airbnb your home
                </Link>
                <a
                  href="#help"
                  onClick={onClose}
                  className="block px-5 py-2 text-sm hover:bg-surface-soft transition text-ink"
                >
                  Help Centre
                </a>
              </div>
            </>
          )}

          <div className="h-px bg-hairline my-1" />

          {/* Persona quick switch section */}
          <div className="px-5 py-2.5 bg-surface-soft/40">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3 w-3 text-rausch" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Demo 1-Click Access
              </p>
            </div>
            <div className="space-y-1">
              {demoUsers.slice(0, 3).map((du) => (
                <button
                  key={du.id}
                  type="button"
                  onClick={() => {
                    demoLogin(du.email);
                    onClose();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-white hover:shadow-xs transition"
                >
                  <span className="truncate font-medium text-ink">{du.name}</span>
                  <span className="text-[10px] text-muted font-medium">{du.role_badge}</span>
                </button>
              ))}
            </div>
          </div>

          {user && (
            <>
              <div className="h-px bg-hairline my-1" />
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full text-left px-5 py-2 text-sm text-danger hover:bg-danger/10 transition font-medium flex items-center gap-2.5"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
