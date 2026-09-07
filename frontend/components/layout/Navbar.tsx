"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSearch } from "@/lib/hooks/useSearch";
import { AccountMenu } from "./AccountMenu";
import { SearchBar } from "@/components/search/SearchBar";
import { AirbnbLogo, MenuIcon, SearchIcon } from "@/components/ui/Icons";

const NAV_TABS = [
  { id: "all", label: "All", icon: <span className="text-xl leading-none select-none">🌐</span> },
  { id: "homes", label: "Homes", icon: <span className="text-xl leading-none select-none">🏡</span> },
  { id: "experiences", label: "Experiences", icon: <span className="text-xl leading-none select-none">🎈</span> },
  { id: "services", label: "Services", icon: <span className="text-xl leading-none select-none">🛎️</span> },
];

export function Navbar() {
  const { user } = useAuth();
  const { isScrolled, setIsSearchExpanded, activeNavTab, setActiveNavTab } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleCompactPillClick() {
    setIsSearchExpanded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "V";

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white border-b border-hairline transition-all duration-300 ease-in-out ${
        isScrolled ? "h-20 shadow-xs" : "h-[164px] shadow-sm"
      }`}
    >
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
        {/* Top Row: Logo, Tabs / Compact Pill, User Menu */}
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Left: Airbnb Brand Wordmark */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <AirbnbLogo className="w-8 h-8 text-[#e01560] group-hover:scale-105 transition-transform" />
            <span className="hidden sm:inline font-bold text-xl tracking-tighter text-[#e01560]">
              airbnb
            </span>
          </Link>

          {/* Center: Morphs between 4 Category Tabs (at top) and Compact Pill (when scrolled) */}
          <div className="flex-1 max-w-xl mx-4 flex items-center justify-center relative h-full">
            {/* 1. Category Tabs (Visible when at top) */}
            <nav
              className={`hidden md:flex items-center gap-8 transition-all duration-300 ease-in-out ${
                isScrolled
                  ? "opacity-0 -translate-y-3 pointer-events-none scale-95 absolute"
                  : "opacity-100 translate-y-0 scale-100"
              }`}
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeNavTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveNavTab(tab.id)}
                    className={`relative flex items-center gap-2 py-3 px-1 transition group text-sm font-medium ${
                      isActive ? "text-ink font-semibold" : "text-bodytext hover:text-ink"
                    }`}
                  >
                    <span className="flex-shrink-0 group-hover:scale-110 transition-transform">
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 2. Compact Search Pill (Visible when scrolled) */}
            <button
              type="button"
              onClick={handleCompactPillClick}
              className={`flex items-center border border-hairline rounded-full py-2 px-4 shadow-sm hover:shadow-md gap-3 text-sm text-ink transition-all duration-300 ease-in-out ${
                isScrolled
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-3 pointer-events-none scale-95 absolute"
              }`}
            >
              <span className="font-semibold text-xs sm:text-sm">Anywhere</span>
              <span className="h-4 w-px bg-hairline" />
              <span className="font-semibold text-xs sm:text-sm">Any week</span>
              <span className="h-4 w-px bg-hairline" />
              <span className="text-muted text-xs sm:text-sm font-normal">Add guests</span>
              <div className="p-2 bg-[#e01560] rounded-full text-white ml-1 flex-shrink-0">
                <SearchIcon className="w-3 h-3" />
              </div>
            </button>
          </div>

          {/* Right: Switch to hosting, User initial circle & 3-lines menu button */}
          <div className="flex items-center gap-2 flex-shrink-0 relative">
            <Link
              href="/host"
              className="hidden sm:block text-sm font-semibold text-ink px-3.5 py-2 rounded-full hover:bg-surface-soft transition"
            >
              Switch to hosting
            </Link>

            {/* User Initial Circle (Green 'V') */}
            <div className="w-9 h-9 rounded-full bg-[#d8f3dc] text-[#1b4332] font-semibold text-sm flex items-center justify-center select-none shadow-2xs">
              {initial}
            </div>

            {/* 3-Lines Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full hover:bg-surface-soft transition text-ink border border-hairline/80"
              aria-label="Main navigation menu"
            >
              <MenuIcon className="w-4 h-4" />
            </button>

            {/* Account Dropdown Menu */}
            <AccountMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>
        </div>

        {/* Row 2: 3-Segment Search Bar directly inside Navbar below icons */}
        <div
          className={`transition-all duration-300 ease-in-out pb-3 ${
            isScrolled
              ? "opacity-0 -translate-y-5 scale-95 pointer-events-none max-h-0 overflow-hidden"
              : "opacity-100 translate-y-0 scale-100 max-h-24"
          }`}
        >
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
