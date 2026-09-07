"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Luggage, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on wizard / checkout flows
  if (pathname.startsWith("/book/") || pathname === "/host/new") {
    return null;
  }

  const items = [
    {
      label: "Explore",
      href: "/",
      icon: Search,
      isActive: pathname === "/",
    },
    {
      label: "Wishlists",
      href: "/wishlists",
      icon: Heart,
      isActive: pathname === "/wishlists",
    },
    {
      label: "Trips",
      href: "/trips",
      icon: Luggage,
      isActive: pathname === "/trips",
    },
    {
      label: "Hosting",
      href: "/host",
      icon: User,
      isActive: pathname.startsWith("/host"),
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-hairline py-2 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                item.isActive
                  ? "text-rausch font-semibold"
                  : "text-muted hover:text-ink font-medium"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${item.isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`}
              />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
