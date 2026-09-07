"use client";

import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ListingCard as ListingCardType, PaginatedResponse } from "@/lib/types";
import { SearchBar, SearchFilters } from "@/components/search/SearchBar";
import { CategoryBar } from "@/components/home/CategoryBar";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { FiltersModal, FilterState } from "@/components/filters/FiltersModal";
import { MapListToggle } from "@/components/map/MapListToggle";
import { DynamicListingMap } from "@/components/map/DynamicListingMap";

export default function HomePage() {
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMapMode, setIsMapMode] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [modalFilters, setModalFilters] = useState<FilterState>({
    minPrice: null,
    maxPrice: null,
    roomType: null,
    propertyType: null,
    bedrooms: null,
    beds: null,
    bathrooms: null,
    amenityIds: [],
  });

  const fetchListings = useCallback(
    async (currentPage: number, append = false) => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: 20,
        };
        if (selectedCategory) params.category = selectedCategory;
        if (searchFilters.location) params.location = searchFilters.location;
        if (searchFilters.checkIn) params.check_in = searchFilters.checkIn;
        if (searchFilters.checkOut) params.check_out = searchFilters.checkOut;
        const totalGuests = searchFilters.adults + searchFilters.children;
        if (totalGuests > 1) params.guests = totalGuests;

        if (modalFilters.minPrice != null) params.min_price = modalFilters.minPrice;
        if (modalFilters.maxPrice != null) params.max_price = modalFilters.maxPrice;
        if (modalFilters.roomType) params.room_type = modalFilters.roomType;
        if (modalFilters.propertyType) params.property_type = modalFilters.propertyType;
        if (modalFilters.bedrooms != null) params.bedrooms = modalFilters.bedrooms;
        if (modalFilters.beds != null) params.beds = modalFilters.beds;
        if (modalFilters.bathrooms != null) params.bathrooms = modalFilters.bathrooms;
        if (modalFilters.amenityIds.length > 0) {
          params.amenities = modalFilters.amenityIds.join(",");
        }

        const res = await api.get<PaginatedResponse<ListingCardType>>("/listings", { params });
        setListings((prev) => (append ? [...prev, ...res.items] : res.items));
        setHasMore(res.has_more);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, searchFilters, modalFilters]
  );

  useEffect(() => {
    setPage(1);
    fetchListings(1, false);
  }, [fetchListings]);

  function handleClearAll() {
    setSelectedCategory(null);
    setSearchFilters({
      location: "",
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    });
    setModalFilters({
      minPrice: null,
      maxPrice: null,
      roomType: null,
      propertyType: null,
      bedrooms: null,
      beds: null,
      bathrooms: null,
      amenityIds: [],
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* 3-Panel Search Bar Header Block */}
      <div className="border-b border-hairline-soft bg-white pb-3 pt-2">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
          <SearchBar initialFilters={searchFilters} onSearch={setSearchFilters} />
        </div>
      </div>

      {/* Horizontal Categories Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilters={() => setIsFiltersOpen(true)}
      />

      {/* Main Content Section */}
      <main className="flex-1 max-w-[2520px] mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-20 py-8">
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
            {Array.from({ length: 12 }).map((_, idx) => (
              <ListingCardSkeleton key={idx} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <span className="text-5xl mb-4">🔍</span>
            <h2 className="text-xl font-bold text-ink mb-2">No exact matches found</h2>
            <p className="text-sm text-muted mb-6">
              Try changing your destination, expanding your date range, or removing active filters.
            </p>
            <button
              onClick={handleClearAll}
              className="px-6 py-3 bg-ink text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : isMapMode ? (
          /* Split View: List on left, Interactive Map on right (Reference 09) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((lst) => (
                <div
                  key={lst.id}
                  onMouseEnter={() => setSelectedListingId(lst.id)}
                  onMouseLeave={() => setSelectedListingId(null)}
                >
                  <ListingCard listing={lst} />
                </div>
              ))}
            </div>
            <div className="hidden lg:block lg:col-span-6 xl:col-span-5 sticky top-40 h-[calc(100vh-180px)]">
              <DynamicListingMap
                listings={listings}
                selectedListingId={selectedListingId}
                onSelectListing={setSelectedListingId}
              />
            </div>
          </div>
        ) : (
          /* Standard Responsive Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {hasMore && (
              <div className="flex flex-col items-center justify-center pt-12 pb-6 gap-2">
                <p className="text-sm text-muted">Showing {listings.length} properties</p>
                <button
                  onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    fetchListings(next, true);
                  }}
                  disabled={loading}
                  className="px-8 py-3.5 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 transition shadow-sm"
                >
                  {loading ? "Loading more..." : "Show more"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Map/List Toggle */}
      <MapListToggle isMapMode={isMapMode} onToggle={() => setIsMapMode(!isMapMode)} />

      {/* Filters Modal */}
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={modalFilters}
        onApply={setModalFilters}
        resultCount={listings.length}
      />
    </div>
  );
}
