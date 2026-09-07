"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountMenu({ isOpen, onClose }: AccountMenuProps) {
  const { user, logout, demoUsers, login, openLoginModal } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.14)] border border-hairline-soft py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
    >
      {user ? (
        <>
          <div className="px-4 py-2 border-b border-hairline-soft">
            <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
            {user.is_superhost && (
              <span className="inline-block mt-1 text-[11px] font-semibold text-rausch bg-red-50 px-2 py-0.5 rounded-full">
                Superhost
              </span>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/trips"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
            >
              Trips
            </Link>
            <Link
              href="/wishlists"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
            >
              Wishlists
            </Link>
          </div>

          <div className="h-px bg-hairline-soft my-1" />

          <div className="py-1">
            {user.is_host ? (
              <Link
                href="/host"
                onClick={onClose}
                className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-soft transition"
              >
                Host Dashboard
              </Link>
            ) : (
              <Link
                href="/host"
                onClick={onClose}
                className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
              >
                Airbnb your home
              </Link>
            )}
            <Link
              href="/account"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
            >
              Account settings
            </Link>
          </div>

          <div className="h-px bg-hairline-soft my-1" />

          {/* Quick Demo Switcher */}
          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
              Switch Demo User
            </p>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {demoUsers.map((du) => {
                const isCurrent = du.email === user.email;
                return (
                  <button
                    key={du.id}
                    onClick={() => {
                      login(du.email);
                      onClose();
                    }}
                    disabled={isCurrent}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition ${
                      isCurrent
                        ? "bg-surface-strong font-semibold text-ink"
                        : "hover:bg-surface-soft text-bodytext"
                    }`}
                  >
                    <span className="truncate mr-2">{du.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
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
                );
              })}
            </div>
          </div>

          <div className="h-px bg-hairline-soft my-1" />

          <div className="py-1">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
            >
              Log out
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="py-1">
            <button
              onClick={() => {
                onClose();
                openLoginModal();
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-soft transition"
            >
              Sign up
            </button>
            <button
              onClick={() => {
                onClose();
                openLoginModal();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
            >
              Log in
            </button>
          </div>

          <div className="h-px bg-hairline-soft my-1" />

          <div className="py-1">
            <Link
              href="/host"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
            >
              Airbnb your home
            </Link>
            <a
              href="#help"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-soft transition"
            >
              Help Centre
            </a>
          </div>

          <div className="h-px bg-hairline-soft my-1" />

          {/* Quick Demo Switcher */}
          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
              Quick Demo Login
            </p>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {demoUsers.slice(0, 5).map((du) => (
                <button
                  key={du.id}
                  onClick={() => {
                    login(du.email);
                    onClose();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between hover:bg-surface-soft transition"
                >
                  <span className="truncate mr-2 font-medium">{du.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
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
          </div>
        </>
      )}
    </div>
  );
}
