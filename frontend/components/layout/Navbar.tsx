"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { AccountMenu } from "./AccountMenu";
import { AirbnbLogo, GlobeIcon, MenuIcon, SearchIcon, UserAvatarIcon } from "@/components/ui/Icons";

export function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"stays" | "experiences">("stays");

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleCompactPillClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-hairline-soft">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 h-20 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <AirbnbLogo className="w-8 h-8 text-rausch group-hover:scale-105 transition-transform" />
          <span className="hidden sm:inline font-bold text-xl tracking-tighter text-rausch">
            airbnb
          </span>
        </Link>

        {/* Center: Tabs or Compact Search Pill */}
        <div className="flex-1 max-w-lg mx-4 flex items-center justify-center">
          {isScrolled ? (
            /* Compact Pill (Reference 02) */
            <button
              onClick={handleCompactPillClick}
              className="flex items-center border border-hairline rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-all duration-200 gap-3 text-sm text-ink animate-in fade-in zoom-in-95"
            >
              <span className="font-semibold text-xs sm:text-sm">Anywhere</span>
              <span className="h-4 w-px bg-hairline" />
              <span className="font-semibold text-xs sm:text-sm">Any week</span>
              <span className="h-4 w-px bg-hairline" />
              <span className="text-muted text-xs sm:text-sm font-normal">Add guests</span>
              <div className="p-2 bg-rausch rounded-full text-white ml-1">
                <SearchIcon className="w-3 h-3" />
              </div>
            </button>
          ) : (
            /* Center Nav Tabs */
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setActiveTab("stays")}
                className={`text-base font-medium transition relative py-2 ${
                  activeTab === "stays" ? "text-ink font-semibold" : "text-muted hover:text-ink"
                }`}
              >
                Stays
                {activeTab === "stays" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-ink rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("experiences")}
                className={`text-base font-medium transition relative py-2 ${
                  activeTab === "experiences"
                    ? "text-ink font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                Experiences
                {activeTab === "experiences" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-ink rounded-full" />
                )}
              </button>
            </nav>
          )}
        </div>

        {/* Right: Utilities & Account Button */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 relative">
          <Link
            href="/host"
            className="hidden sm:block text-sm font-semibold text-ink px-3.5 py-2.5 rounded-full hover:bg-surface-soft transition"
          >
            {user?.is_host ? "Switch to hosting" : "Airbnb your home"}
          </Link>

          <button
            aria-label="Language & Currency"
            className="p-2.5 text-ink rounded-full hover:bg-surface-soft transition"
          >
            <GlobeIcon className="w-4 h-4" />
          </button>

          {/* Account Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 border border-hairline rounded-full py-1.5 px-3 hover:shadow-md transition ml-1"
            aria-label="User Account Menu"
          >
            <MenuIcon className="w-4 h-4 text-ink" />
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-surface-soft text-muted">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserAvatarIcon className="w-6 h-6" />
              )}
            </div>
          </button>

          {/* Account Dropdown */}
          <AccountMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
}
