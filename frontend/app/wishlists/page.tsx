"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { api } from "@/lib/api";
import { ListingCard as ListingCardType } from "@/lib/types";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingGridSkeleton } from "@/components/ui/Skeleton";
import { springFast, staggerContainer, fadeUpVariants } from "@/lib/motion";
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft text-rausch">
          <Heart className="w-7 h-7" />
        </div>
        <h1 className="t-display-lg text-ink">Log in to view your wishlists</h1>
        <p className="text-xs sm:text-sm text-muted">
          You can create, view, or edit wishlists once you are logged in.
        </p>
        <button
          onClick={openLoginModal}
          className="h-12 rounded-sm bg-rausch px-6 t-button-md font-semibold text-white transition-colors duration-150 hover:bg-rausch-active"
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
        <h1 className="text-[32px] font-semibold tracking-[-0.6px] text-ink">Wishlists</h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          {listings.length} {listings.length === 1 ? "saved stay" : "saved stays"}
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <ListingGridSkeleton count={8} />
      ) : listings.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
        >
          <AnimatePresence mode="popLayout">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                variants={fadeUpVariants}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                transition={springFast}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center max-w-sm mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-surface-soft text-muted mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="t-display-sm text-ink">Your wishlist is empty</h3>
          <p className="text-xs text-muted leading-relaxed">
            As you search, tap the heart icon on any stay to save your favourite places to your wishlist.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 t-button-md font-semibold text-white transition-opacity duration-150 hover:opacity-90"
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
