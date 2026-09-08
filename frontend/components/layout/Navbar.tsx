"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "@/lib/hooks/useSearch";
import { useAuth } from "@/lib/hooks/useAuth";
import { AccountMenu } from "./AccountMenu";
import { SearchBar } from "@/components/search/SearchBar";
import { MobileSearchOverlay } from "@/components/search/MobileSearchOverlay";
import { AirbnbLogo, GlobeIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { User } from "@/lib/types";
import {
  springMedium,
  springFast,
  fadeFast,
  fadeBase,
  tapScale,
} from "@/lib/motion";

const NAV_TABS = [
  { id: "all", label: "All", icon: "🌐" },
  { id: "homes", label: "Homes", icon: "🏡" },
  { id: "experiences", label: "Experiences", icon: "🎈" },
  { id: "services", label: "Services", icon: "🛎️" },
];

/** Reference 01: nav row 80px + search bar 72px + 32px of breathing room below it. */
const HEADER_EXPANDED = 184;
const HEADER_COMPACT = 80;

export function Navbar() {
  const pathname = usePathname();
  const {
    filters,
    setFilters,
    isScrolled,
    isSearchExpanded,
    setIsSearchExpanded,
    activeNavTab,
    setActiveNavTab,
  } = useSearch();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchKey, setMobileSearchKey] = useState(0);

  const isHome = pathname === "/";
  const totalGuests = (filters.adults || 0) + (filters.children || 0);
  const hasActiveSearch = Boolean(
    filters.location || filters.checkIn || filters.checkOut || totalGuests > 1
  );

  // When searching or on room/subpages, navbar starts compact with pill
  const expanded = isHome && !hasActiveSearch ? !isScrolled || isSearchExpanded : isSearchExpanded;

  const locationLabel = filters.location ? `Homes in ${filters.location}` : "Anywhere";
  const whenLabel = filters.checkIn && filters.checkOut
    ? `${new Date(filters.checkIn).getDate()}–${new Date(filters.checkOut).getDate()} ${new Date(filters.checkIn).toLocaleDateString("en-GB", { month: "short" })}`
    : filters.checkIn || "Any week";
  const guestsLabel = totalGuests > 1 ? `${totalGuests} guests` : totalGuests === 1 ? "1 guest" : "Add guests";

  const collapse = useCallback(() => setIsSearchExpanded(false), [setIsSearchExpanded]);

  function openSearch() {
    setIsSearchExpanded(true);
    if (isHome && !hasActiveSearch) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLogoClick() {
    setIsSearchExpanded(false);
    setFilters({ location: "", checkIn: "", checkOut: "", adults: 1, children: 0, infants: 0, pets: 0 });
  }

  useEffect(() => { setIsSearchExpanded(false); }, [pathname, setIsSearchExpanded]);

  useEffect(() => {
    if (!expanded || (isHome && !hasActiveSearch && !isScrolled)) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") collapse(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded, isHome, hasActiveSearch, isScrolled, collapse]);

  const isOverlay = expanded && (!isHome || isScrolled || hasActiveSearch);

  if (pathname.startsWith("/host")) {
    return (
      <HostNavigation
        user={user}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOverlay && (
          <motion.div
            className="fixed inset-0 z-30 bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={collapse}
          />
        )}
      </AnimatePresence>

      <motion.header
        className="sticky top-0 z-40 w-full border-b border-hairline-soft bg-white"
        initial={false}
        animate={{
          boxShadow: isScrolled
            ? "0 1px 0 rgba(0,0,0,0.04), 0 2px 10px rgba(0,0,0,0.04)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={fadeBase}
      >
        {/* ---------------- Desktop ---------------- */}
        <motion.div
          className="mx-auto hidden max-w-[2520px] px-6 md:block md:px-10 lg:px-20"
          initial={false}
          animate={{ height: expanded ? HEADER_EXPANDED : HEADER_COMPACT }}
          transition={springMedium}
        >
          <div className="relative flex h-20 items-center justify-between gap-4">
            <Link href="/" onClick={handleLogoClick} aria-label="Airbnb home" className="flex shrink-0 items-center gap-1.5 text-rausch">
              <AirbnbLogo className="h-8 w-8" />
              <span className="hidden text-[22px] font-bold tracking-[-1.1px] lg:inline">airbnb</span>
            </Link>

            {/* Centre slot — product tabs on pristine homepage when expanded, compact pill when collapsed */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <AnimatePresence mode="wait" initial={false}>
                {expanded && isHome && !hasActiveSearch ? (
                  <motion.nav
                    key="tabs"
                    aria-label="Explore Airbnb"
                    className="flex items-center gap-8"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={fadeFast}
                  >
                    {NAV_TABS.map((tab) => {
                      const active = activeNavTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveNavTab(tab.id)}
                          className="group relative flex items-center gap-2 px-1 pb-4 pt-5"
                        >
                          <motion.span className="text-[28px] leading-none" whileHover={{ scale: 1.12, y: -2 }} transition={springFast}>
                            {tab.icon}
                          </motion.span>
                          <span className={`t-title-md transition-colors duration-150 ${active ? "text-ink" : "text-muted group-hover:text-ink"}`}>
                            {tab.label}
                          </span>
                          {active && (
                            <motion.span
                              layoutId="nav-tab-underline"
                              className="absolute bottom-1 left-auto right-1 h-[2px] w-[calc(100%-2.4rem)] rounded-full bg-ink"
                              transition={springFast}
                            />
                          )}
                        </button>
                      );
                    })}
                  </motion.nav>
                ) : !expanded ? (
                  <motion.button
                    key="pill"
                    type="button"
                    onClick={openSearch}
                    className="flex h-12 items-center rounded-full border border-hairline bg-white pl-2 pr-2 shadow-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12, ease: "easeOut" } }}
                    transition={springFast}
                    whileHover={{ boxShadow: "rgba(0,0,0,0.04) 0 0 0 1px, rgba(0,0,0,0.10) 0 3px 10px 0" }}
                  >
                    <span className="pl-1 pr-1 text-[20px] leading-none">🏡</span>
                    <span className="t-button-sm max-w-[170px] truncate px-2 font-medium text-ink">{locationLabel}</span>
                    <span className="h-6 w-px bg-hairline" />
                    <span className="t-button-sm px-3 text-ink">{whenLabel}</span>
                    <span className="h-6 w-px bg-hairline" />
                    <span className="t-button-sm px-3 text-ink">{guestsLabel}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rausch text-white">
                      <SearchIcon className="h-3 w-3" />
                    </span>
                  </motion.button>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="relative ml-auto flex shrink-0 items-center gap-1">
              <Link href="/host" className="t-button-sm rounded-full px-3 py-3 font-semibold text-ink transition-colors duration-150 hover:bg-surface-soft">
                Become a host
              </Link>
              <motion.button
                type="button"
                aria-label="Choose language"
                whileTap={tapScale}
                transition={springFast}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-surface-soft"
              >
                <GlobeIcon className="h-4 w-4" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label="Main menu"
                aria-expanded={isMenuOpen}
                whileTap={tapScale}
                transition={springFast}
                className="flex items-center gap-3 rounded-full border border-hairline bg-white py-1.5 pl-3.5 pr-1.5 text-ink transition-shadow duration-150 hover:shadow-card focus:outline-none"
              >
                <MenuIcon className="h-4 w-4" />
                {user ? (
                  user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover border border-hairline/60"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rausch text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-strong text-muted">
                    <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                      <path d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm0 4a5 5 0 1 1-5 5 5 5 0 0 1 5-5zm0 24a12.9 12.9 0 0 1-8.5-3.2A6.9 6.9 0 0 1 14 19h4a6.9 6.9 0 0 1 6.5 6.8A12.9 12.9 0 0 1 16 29z" />
                    </svg>
                  </div>
                )}
              </motion.button>
              <AccountMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            </div>
          </div>

          {/* Expanded search bar */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="searchbar"
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.95, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: -16,
                  transition: { duration: 0.15, ease: "easeOut" },
                }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                style={{ originY: 0 }}
              >
                <SearchBar onSubmitted={collapse} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ---------------- Mobile ---------------- */}
        <div className="flex h-[88px] flex-col justify-center px-6 md:hidden">
          <motion.button
            type="button"
            onClick={() => {
              setMobileSearchKey((k) => k + 1);
              setIsMobileSearchOpen(true);
            }}
            whileTap={{ scale: 0.98 }}
            transition={springFast}
            className="mx-auto flex h-14 w-full max-w-xl items-center gap-3 rounded-full border border-hairline bg-white px-5 shadow-card"
          >
            <SearchIcon className="h-[18px] w-[18px] text-ink" />
            <span className="flex flex-col items-start leading-tight">
              <span className="t-button-sm font-semibold text-ink">
                {filters.location ? `Homes in ${filters.location}` : "Where to?"}
              </span>
              <span className="text-[12px] text-muted">
                {filters.location
                  ? `${whenLabel} · ${guestsLabel}`
                  : "Anywhere · Any week · Add guests"}
              </span>
            </span>
          </motion.button>
        </div>
      </motion.header>

      <MobileSearchOverlay
        key={mobileSearchKey}
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
}

function HostNavigation({
  user,
  isMenuOpen,
  setIsMenuOpen,
}: {
  user: User | null;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [active, setActive] = useState("Today");
  const links = [
    ["Today", "/host#today"],
    ["Calendar", "/host#calendar"],
    ["Listings", "/host#listings"],
    ["Messages", "/host#messages"],
  ];

  useEffect(() => {
    const syncActiveLink = () => {
      const match = links.find(([, href]) => href.endsWith(window.location.hash));
      setActive(match?.[0] || "Today");
    };
    queueMicrotask(syncActiveLink);
    window.addEventListener("hashchange", syncActiveLink);
    return () => window.removeEventListener("hashchange", syncActiveLink);
  // The links are static navigation configuration.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-white">
      <div className="mx-auto flex h-20 max-w-[2520px] items-center justify-between gap-4 px-5 md:px-10 lg:px-12">
        <Link href="/host" aria-label="Host dashboard" className="flex shrink-0 items-center gap-1.5 text-rausch">
          <AirbnbLogo className="h-9 w-9" />
          <span className="hidden text-[22px] font-bold tracking-[-1.1px] lg:inline">airbnb</span>
        </Link>

        <nav aria-label="Hosting" className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-12 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className={`flex h-full items-center border-b-2 px-1 text-[16px] font-semibold transition ${active === label ? "border-ink text-ink" : "border-transparent text-[#6a6a6a] hover:text-ink"}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className="relative ml-auto flex items-center gap-4">
          <Link href="/" className="mr-2 hidden rounded-full px-3 py-2.5 text-[16px] font-semibold text-ink hover:bg-surface-soft sm:block">
            Switch to travelling
          </Link>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dff3e4] text-[17px] font-semibold text-[#096c2e]">
            {user?.name.charAt(0).toUpperCase() || "H"}
          </span>
          <button type="button" onClick={() => setIsMenuOpen((open) => !open)} aria-label="Host account menu" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f2f2] text-ink transition hover:bg-[#e8e8e8]">
            <MenuIcon className="h-5 w-5" />
          </button>
          <AccountMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
}
