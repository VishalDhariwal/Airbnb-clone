"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./useAuth";

interface WishlistContextType {
  savedIds: Set<number>;
  isSaved: (listingId: number) => boolean;
  toggleWishlist: (listingId: number) => Promise<boolean>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, openLoginModal } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .get<number[]>("/wishlist/ids")
        .then((ids) => setSavedIds(new Set(ids)))
        .catch(() => setSavedIds(new Set()))
        .finally(() => setLoading(false));
    } else {
      setSavedIds(new Set());
    }
  }, [user]);

  async function toggleWishlist(listingId: number): Promise<boolean> {
    if (!user) {
      openLoginModal();
      return false;
    }

    const wasSaved = savedIds.has(listingId);
    // Optimistic local update
    const updated = new Set(savedIds);
    if (wasSaved) {
      updated.delete(listingId);
    } else {
      updated.add(listingId);
    }
    setSavedIds(updated);

    try {
      if (wasSaved) {
        await api.delete(`/wishlist/${listingId}`);
        return false;
      } else {
        await api.post(`/wishlist/${listingId}`);
        return true;
      }
    } catch {
      // Revert on error
      setSavedIds(savedIds);
      return wasSaved;
    }
  }

  function isSaved(listingId: number): boolean {
    return savedIds.has(listingId);
  }

  return (
    <WishlistContext.Provider value={{ savedIds, isSaved, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
