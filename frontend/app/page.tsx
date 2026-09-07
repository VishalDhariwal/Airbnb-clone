"use client";

import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ListingCard as ListingCardType, PaginatedResponse } from "@/lib/types";
import { useSearch } from "@/lib/hooks/useSearch";
import { CategoryBar } from "@/components/home/CategoryBar";
import { HomeReservationBanner } from "@/components/home/HomeReservationBanner";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { FiltersModal, FilterState } from "@/components/filters/FiltersModal";
import { MapListToggle } from "@/components/map/MapListToggle";
import { DynamicListingMap } from "@/components/map/DynamicListingMap";

export default function HomePage() {
  const { filters: searchFilters, setFilters } = useSearch();

  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMapMode, setIsMapMode] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

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
    setFilters({
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
      {/* Reservation reminder pill banner directly below unified navbar */}
      <HomeReservationBanner />

      {/* Horizontal Categories Filter Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilters={() => setIsFiltersOpen(true)}
      />

      {/* Main Content Section */}
      <main className="flex-1 max-w-[2520px] mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-20 py-6">
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
          /* Split View: List on left, Interactive Map on right */
          <div className="flex gap-6 h-[calc(100vh-280px)]">
            <div className="w-full lg:w-3/5 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setSelectedListingId(item.id)}
                  onMouseLeave={() => setSelectedListingId(null)}
                >
                  <ListingCard listing={item} />
                </div>
              ))}
            </div>
            <div className="hidden lg:block lg:w-2/5 h-full rounded-2xl overflow-hidden border border-hairline shadow-sm sticky top-0">
              <DynamicListingMap
                listings={listings}
                selectedListingId={selectedListingId}
                onSelectListing={setSelectedListingId}
              />
            </div>
          </div>
        ) : (
          /* Grid View */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
              {listings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>

            {/* Load More Pagination */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchListings(nextPage, true);
                  }}
                  disabled={loading}
                  className="px-8 py-3.5 bg-ink text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Show more"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Map/List View Toggle */}
      <MapListToggle isMapMode={isMapMode} onToggle={() => setIsMapMode(!isMapMode)} />

      {/* Full Filters Modal */}
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={modalFilters}
        onApply={(newFilters) => {
          setModalFilters(newFilters);
          setIsFiltersOpen(false);
        }}
      />
    </div>
  );
}
