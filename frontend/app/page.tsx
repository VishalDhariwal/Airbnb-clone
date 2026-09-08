"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/lib/api";
import {
  HomeSection,
  ListingCard as ListingCardType,
  PaginatedResponse,
} from "@/lib/types";
import { useSearch } from "@/lib/hooks/useSearch";
import { HomeSectionCarousel, PAGE_X } from "@/components/home/HomeSectionCarousel";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import {
  SearchFilterStrip,
  QuickFilter,
} from "@/components/search/SearchFilterStrip";
import { FiltersModal, FilterState } from "@/components/filters/FiltersModal";
import { DynamicListingMap } from "@/components/map/DynamicListingMap";
import { MapListToggle } from "@/components/map/MapListToggle";
import { easeStandard, fadeBase, springSlow, staggerContainer } from "@/lib/motion";

const EMPTY_FILTERS: FilterState = {
  minPrice: null, maxPrice: null, roomType: null, propertyType: null,
  bedrooms: null, beds: null, bathrooms: null, amenityIds: [],
};

export default function HomePage() {
  const { filters, activeNavTab } = useSearch();
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [results, setResults] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);

  const [showMap, setShowMap] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quick, setQuick] = useState<QuickFilter[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [advanced, setAdvanced] = useState<FilterState>(EMPTY_FILTERS);

  const isSearching = Boolean(
    filters.location || filters.checkIn || filters.checkOut || filters.adults > 1
  );

  useEffect(() => {
    setLoading(true);

    if (!isSearching) {
      api
        .get<HomeSection[]>("/listings/home-sections", {
          params: activeNavTab ? { tab: activeNavTab } : undefined,
        })
        .then((homeSections) => {
          setSections(homeSections);
          setResults([]);
        })
        .catch((error) => console.error("Failed to load homepage:", error))
        .finally(() => setLoading(false));
      return;
    }

    const params: Record<string, string | number> = { page: 1, limit: 60 };
    if (filters.location) params.location = filters.location;
    if (filters.checkIn) params.check_in = filters.checkIn;
    if (filters.checkOut) params.check_out = filters.checkOut;
    if (filters.adults + filters.children > 1) params.guests = filters.adults + filters.children;
    if (advanced.minPrice) params.min_price = advanced.minPrice;
    if (advanced.maxPrice) params.max_price = advanced.maxPrice;
    if (advanced.roomType) params.room_type = advanced.roomType;
    if (advanced.propertyType) params.property_type = advanced.propertyType;
    if (advanced.bedrooms) params.bedrooms = advanced.bedrooms;

    api
      .get<PaginatedResponse<ListingCardType>>("/listings", { params })
      .then((response) => setResults(response.items))
      .catch((error) => console.error("Failed to load results:", error))
      .finally(() => setLoading(false));
  }, [filters, isSearching, advanced, activeNavTab]);

  const visible = useMemo(() => {
    if (!quick.includes("Guest favourite")) return results;
    return results.filter((l) => l.is_guest_favorite);
  }, [results, quick]);

  const activeFilterCount = Object.entries(advanced).filter(([, v]) =>
    Array.isArray(v) ? v.length > 0 : v !== null
  ).length;

  function toggleQuick(f: QuickFilter) {
    setQuick((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  /* ------------------------- Homepage ------------------------- */
  if (!isSearching) {
    return (
      <main className="min-h-screen bg-white pb-16 pt-8 md:pt-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              exit={{ opacity: 0 }}
              transition={fadeBase}
              className={`space-y-14 ${PAGE_X}`}
            >
              {[0, 1, 2].map((row) => (
                <section key={row}>
                  <div className="mb-4 h-7 w-72 animate-pulse rounded-lg bg-surface-strong" />
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ListingCardSkeleton key={i} />
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: easeStandard }}
              className="space-y-12 md:space-y-14"
            >
              {sections.map((section, i) => (
                <HomeSectionCarousel key={section.id} section={section} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    );
  }

  /* ---------------------- Search results ---------------------- */
  return (
    <>
      <SearchFilterStrip
        active={quick}
        onToggle={toggleQuick}
        onOpenFilters={() => setIsFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <main className={`min-h-screen bg-white pb-24 pt-6 ${showMap ? "px-0" : PAGE_X}`}>
        <div className={showMap ? "flex gap-0" : ""}>
          {/* Results column */}
          <motion.div
            layout
            transition={springSlow}
            className={showMap ? "w-full px-6 lg:w-[55%] lg:px-10" : "w-full"}
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="t-display-sm text-ink font-semibold">
                  {loading
                    ? "Searching…"
                    : visible.length
                    ? `${visible.length} ${visible.length === 1 ? "home" : "homes"}${filters.location ? ` in ${filters.location}` : ""}`
                    : "No exact matches"}
                </h1>
                <span className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft/60 px-3 py-1 text-xs font-medium text-ink">
                  <span aria-hidden="true">🏷️</span>
                  Prices include all fees
                </span>
              </div>
            </div>

            {loading ? (
              <div className={`grid gap-x-6 gap-y-8 ${showMap ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
                {Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)}
              </div>
            ) : visible.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                layout
                transition={springSlow}
                className={`grid gap-x-6 gap-y-8 ${showMap ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}
              >
                {visible.map((listing) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: easeStandard }}
                    onMouseEnter={() => setSelectedId(listing.id)}
                    onMouseLeave={() => setSelectedId(null)}
                  >
                    <ListingCard listing={listing} variant="search" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-16 text-center">
                <p className="t-display-sm mb-2 text-ink">No exact matches</p>
                <p className="t-body-md text-muted">Try changing or removing some of your filters.</p>
              </div>
            )}
          </motion.div>

          {/* Map column */}
          <AnimatePresence>
            {showMap && (
              <motion.aside
                key="map"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={springSlow}
                className="sticky top-[9.5rem] hidden h-[calc(100vh-9.5rem)] w-[45%] py-2 pr-6 lg:block"
              >
                <div className="h-full w-full overflow-hidden rounded-2xl">
                  <DynamicListingMap
                    listings={visible}
                    selectedListingId={selectedId}
                    onSelectListing={setSelectedId}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        <MapListToggle isMapMode={showMap} onToggle={() => setShowMap((v) => !v)} />
      </main>

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={advanced}
        onApply={setAdvanced}
        resultCount={visible.length}
      />
    </>
  );
}
