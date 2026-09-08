"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { springFast } from "@/lib/motion";

export function BottomNav() {
  const pathname = usePathname();
  const { user, openLoginModal } = useAuth();

  // Hide bottom nav on wizard / checkout flows
  // These flows own the bottom edge of the screen on mobile.
  if (
    pathname.startsWith("/book/") ||
    pathname.startsWith("/rooms/") ||
    pathname.startsWith("/host")
  ) {
    return null;
  }

  const items = [
    {
      label: "Explore",
      href: "/",
      icon: Search,
      isActive: pathname === "/",
      onClick: undefined,
    },
    {
      label: "Wishlists",
      href: "/wishlists",
      icon: Heart,
      isActive: pathname === "/wishlists",
      onClick: undefined,
    },
    {
      label: user ? "Profile" : "Log in",
      href: user ? "/trips" : "#login",
      icon: CircleUserRound,
      isActive: false,
      onClick: user ? undefined : openLoginModal,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-hairline py-2 px-8 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(event) => {
                if (item.onClick) {
                  event.preventDefault();
                  item.onClick();
                }
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                item.isActive
                  ? "text-rausch font-semibold"
                  : "text-muted hover:text-ink font-medium"
              }`}
            >
              <motion.span
                animate={{ scale: item.isActive ? 1.08 : 1 }}
                whileTap={{ scale: 0.88 }}
                transition={springFast}
              >
                <Icon
                  className={`h-5 w-5 ${item.isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`}
                />
              </motion.span>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
