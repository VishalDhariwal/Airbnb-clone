"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Heart,
  Briefcase,
  MessageSquare,
  User,
  Bell,
  Settings,
  Globe,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountMenu({ isOpen, onClose }: AccountMenuProps) {
  const { user, logout, demoUsers, login } = useAuth();
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

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-3 w-72 bg-white rounded-3xl shadow-[0_6px_32px_rgba(0,0,0,0.18)] border border-hairline py-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-ink"
    >
      {/* Group 1: User Actions */}
      <div className="py-1">
        <Link
          href="/wishlists"
          onClick={onClose}
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition"
        >
          <Heart className="w-4 h-4 text-ink" />
          <span>Wishlists</span>
        </Link>
        <Link
          href="/trips"
          onClick={onClose}
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition"
        >
          <Briefcase className="w-4 h-4 text-ink" />
          <span>Trips</span>
        </Link>
        <Link
          href="/trips"
          onClick={onClose}
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition"
        >
          <MessageSquare className="w-4 h-4 text-ink" />
          <span>Messages</span>
        </Link>
        <Link
          href="/account"
          onClick={onClose}
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition"
        >
          <User className="w-4 h-4 text-ink" />
          <span>Profile</span>
        </Link>
      </div>

      <div className="h-px bg-hairline my-1.5" />

      {/* Group 2: Settings & Support */}
      <div className="py-1">
        <Link
          href="/account"
          onClick={onClose}
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition"
        >
          <Bell className="w-4 h-4 text-ink" />
          <span>Notifications</span>
        </Link>
        <Link
          href="/account"
          onClick={onClose}
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition"
        >
          <Settings className="w-4 h-4 text-ink" />
          <span>Account settings</span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition text-left"
        >
          <Globe className="w-4 h-4 text-ink" />
          <span>Languages & currency</span>
        </button>
        <a
          href="#help"
          onClick={onClose}
          className="flex items-center gap-3.5 px-5 py-2.5 text-sm hover:bg-surface-soft transition"
        >
          <HelpCircle className="w-4 h-4 text-ink" />
          <span>Help Centre</span>
        </a>
      </div>

      <div className="h-px bg-hairline my-1.5" />

      {/* Group 3: Become a host promo card */}
      <div className="px-3 py-1">
        <Link
          href="/host"
          onClick={onClose}
          className="block p-3 rounded-2xl hover:bg-surface-soft transition border border-hairline/60 group"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-ink">Become a host</p>
              <p className="text-[11px] text-muted leading-tight mt-0.5 max-w-[170px]">
                It&apos;s easy to start hosting and earn extra income.
              </p>
            </div>
            <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              🧍
            </span>
          </div>
        </Link>
      </div>

      <div className="py-1">
        <Link
          href="/host"
          onClick={onClose}
          className="block px-5 py-2 text-sm hover:bg-surface-soft transition"
        >
          Refer a host
        </Link>
        <Link
          href="/host"
          onClick={onClose}
          className="block px-5 py-2 text-sm hover:bg-surface-soft transition"
        >
          Find a co-host
        </Link>
      </div>

      <div className="h-px bg-hairline my-1.5" />

      {/* Group 4: Quick Demo Switcher & Logout */}
      <div className="px-5 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
          Switch User
        </p>
        <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
          {demoUsers.slice(0, 3).map((du) => (
            <button
              key={du.id}
              onClick={() => {
                login(du.email);
                onClose();
              }}
              className="w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between hover:bg-surface-soft"
            >
              <span className="truncate">{du.name}</span>
              <span className="text-[10px] text-muted">{du.role_badge}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-hairline my-1" />

      <div className="py-1">
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full text-left px-5 py-2 text-sm text-ink hover:bg-surface-soft transition font-medium"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
