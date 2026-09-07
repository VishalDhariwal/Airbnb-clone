"use client";

import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ListingCard as ListingCardType, PaginatedResponse } from "@/lib/types";
import { SearchBar, SearchFilters } from "@/components/search/SearchBar";
import { CategoryBar } from "@/components/home/CategoryBar";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";

export default function HomePage() {
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
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
        if (filters.location) params.location = filters.location;
        if (filters.checkIn) params.check_in = filters.checkIn;
        if (filters.checkOut) params.check_out = filters.checkOut;
        const totalGuests = filters.adults + filters.children;
        if (totalGuests > 1) params.guests = totalGuests;

        const res = await api.get<PaginatedResponse<ListingCardType>>("/listings", { params });
        setListings((prev) => (append ? [...prev, ...res.items] : res.items));
        setHasMore(res.has_more);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, filters]
  );

  useEffect(() => {
    setPage(1);
    fetchListings(1, false);
  }, [fetchListings]);

  function handleSearch(newFilters: SearchFilters) {
    setFilters(newFilters);
  }

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage, true);
  }

  function handleClearFilters() {
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 3-Panel Search Bar Header Block */}
      <div className="border-b border-hairline-soft bg-white pb-3 pt-2">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
          <SearchBar initialFilters={filters} onSearch={handleSearch} />
        </div>
      </div>

      {/* Horizontal Categories Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Main Grid Section */}
      <main className="flex-1 max-w-[2520px] mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-20 py-8">
        {loading && listings.length === 0 ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
            {Array.from({ length: 12 }).map((_, idx) => (
              <ListingCardSkeleton key={idx} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <span className="text-5xl mb-4">🔍</span>
            <h2 className="text-xl font-bold text-ink mb-2">No exact matches found</h2>
            <p className="text-sm text-muted mb-6">
              Try changing your destination, expanding your date range, or removing active filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-ink text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Property Cards Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex flex-col items-center justify-center pt-12 pb-6 gap-2">
                <p className="text-sm text-muted">Showing {listings.length} properties</p>
                <button
                  onClick={handleLoadMore}
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
    </div>
  );
}
