"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { api } from "@/lib/api";
import { ListingCard as ListingCardType } from "@/lib/types";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingGridSkeleton } from "@/components/ui/Skeleton";
import { Heart, Compass, Loader2 } from "lucide-react";

export default function WishlistsPage() {
  const { user, loading: authLoading, openLoginModal } = useAuth();
  const { savedIds } = useWishlist();
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await api.get<ListingCardType[]>("/wishlist");
      setListings(data || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, savedIds]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rausch animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-rausch mx-auto flex items-center justify-center">
          <Heart className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Log in to view your wishlists</h1>
        <p className="text-xs sm:text-sm text-muted">
          You can create, view, or edit wishlists once you are logged in.
        </p>
        <button
          onClick={openLoginModal}
          className="px-6 py-3 bg-rausch hover:bg-rausch-hover text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          Log in or sign up
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ink tracking-tight">Wishlists</h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          {listings.length} {listings.length === 1 ? "saved stay" : "saved stays"}
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <ListingGridSkeleton count={8} />
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center max-w-sm mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-surface-soft text-muted mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-ink">Your wishlist is empty</h3>
          <p className="text-xs text-muted leading-relaxed">
            As you search, tap the heart icon on any stay to save your favourite places to your wishlist.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink hover:bg-black text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Compass className="w-4 h-4" />
              <span>Start exploring</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
