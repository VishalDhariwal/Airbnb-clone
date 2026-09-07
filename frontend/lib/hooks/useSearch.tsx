"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  executeSearch: (newFilters?: Partial<SearchFilters>) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  isScrolled: boolean;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (expanded: boolean) => void;
}

const defaultFilters: SearchFilters = {
  location: "",
  checkIn: "",
  checkOut: "",
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};

const SearchContext = createContext<SearchContextType>({
  filters: defaultFilters,
  setFilters: () => {},
  executeSearch: () => {},
  activeNavTab: "all",
  setActiveNavTab: () => {},
  isScrolled: false,
  isSearchExpanded: true,
  setIsSearchExpanded: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [activeNavTab, setActiveNavTab] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);

  // Monitor scroll state for smooth navbar morphing
  useEffect(() => {
    function handleScroll() {
      const scrolled = window.scrollY > 30;
      setIsScrolled(scrolled);
      if (scrolled) {
        setIsSearchExpanded(false);
      } else {
        setIsSearchExpanded(true);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const executeSearch = (overrideFilters?: Partial<SearchFilters>) => {
    const active = overrideFilters ? { ...filters, ...overrideFilters } : filters;
    setFilters(active);

    const queryParams = new URLSearchParams();
    if (active.location) queryParams.set("location", active.location);
    if (active.checkIn) queryParams.set("check_in", active.checkIn);
    if (active.checkOut) queryParams.set("check_out", active.checkOut);
    const totalGuests = active.adults + active.children;
    if (totalGuests > 1) queryParams.set("guests", String(totalGuests));

    const queryString = queryParams.toString();
    const targetUrl = queryString ? `/?${queryString}` : "/";

    if (pathname !== "/") {
      router.push(targetUrl);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        filters,
        setFilters,
        executeSearch,
        activeNavTab,
        setActiveNavTab,
        isScrolled,
        isSearchExpanded,
        setIsSearchExpanded,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
