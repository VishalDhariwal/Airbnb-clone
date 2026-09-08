"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { api } from "@/lib/api";
import { HostListing, HostReservation } from "@/lib/types/host";
import { HostMetrics } from "@/components/host/HostMetrics";
import { HostListingsSection } from "@/components/host/HostListingsSection";
import { HostEditModal } from "@/components/host/HostEditModal";
import { HostDeleteDialog } from "@/components/host/HostDeleteDialog";
import { HostEmptyState } from "@/components/host/HostEmptyState";
import { HostCalendar } from "@/components/host/HostCalendar";
import { HostToday } from "@/components/host/HostToday";
import { HostDashboardSkeleton } from "@/components/ui/Skeleton";
import { Plus, Sparkles, Loader2, MessageSquare } from "lucide-react";

export default function HostDashboardPage() {
  const { user, loading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"today" | "calendar" | "listings" | "messages">("today");
  const [listings, setListings] = useState<HostListing[]>([]);
  const [reservations, setReservations] = useState<HostReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals state
  const [editingListing, setEditingListing] = useState<HostListing | null>(null);
  const [deletingListing, setDeletingListing] = useState<HostListing | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [listingsData, reservationsData] = await Promise.all([
        api.get<HostListing[]>("/host/listings"),
        api.get<HostReservation[]>("/host/reservations"),
      ]);
      setListings(listingsData || []);
      setReservations(reservationsData || []);
    } catch (err) {
      console.error("Failed to fetch host data:", err);
      setLoadError(err instanceof Error ? err.message : "Could not load your hosting data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.is_host) {
      queueMicrotask(fetchData);
    }
  }, [user, fetchData]);

  useEffect(() => {
    const syncTabFromHash = () => {
      const requestedView = new URLSearchParams(window.location.search).get("view");
      if (window.location.hash === "#calendar" || requestedView === "calendar") setActiveTab("calendar");
      else if (window.location.hash === "#listings" || requestedView === "listings") setActiveTab("listings");
      else if (window.location.hash === "#messages" || requestedView === "messages") setActiveTab("messages");
      else setActiveTab("today");
    };
    queueMicrotask(syncTabFromHash);
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/host/listings/${id}`, { is_active: !currentStatus });
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_active: !currentStatus } : l))
      );
      showToast(currentStatus ? "Listing unlisted" : "Listing published", "info");
    } catch {
      showToast("Failed to update listing status", "error");
    }
  };

  const handleSaveEdit = async (id: number, data: Partial<HostListing>) => {
    try {
      const updated = await api.patch<HostListing>(`/host/listings/${id}`, data);
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
      showToast("Listing updated successfully", "success");
    } catch {
      showToast("Failed to update listing", "error");
    }
  };

  const handleDeleteListing = async (id: number) => {
    try {
      await api.delete(`/host/listings/${id}`);
      showToast("Listing removed", "info");
      await fetchData();
    } catch {
      showToast("Failed to delete listing", "error");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rausch animate-spin" />
      </div>
    );
  }

  if (!user || !user.is_host) {
    return <HostEmptyState />;
  }

  return (
    <div id="today" className="min-h-[calc(100vh-81px)] bg-white">
      {isLoading ? (
        <div className="mx-auto max-w-[1280px] px-6 py-10"><HostDashboardSkeleton /></div>
      ) : loadError ? (
        <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-lg flex-col items-center justify-center px-6 pb-24 text-center">
          <h1 className="text-2xl font-bold text-ink">We couldn’t load your listings</h1>
          <p className="mt-3 text-sm text-muted">{loadError}</p>
          <button type="button" onClick={fetchData} className="mt-6 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white">Try again</button>
        </main>
      ) : activeTab === "today" ? (
        <HostToday listings={listings} reservations={reservations} />
      ) : activeTab === "listings" ? (
        <main id="listings" className="mx-auto max-w-[1280px] space-y-8 px-4 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-ink sm:text-3xl">Your listings</h1>
                {user.is_superhost && <Sparkles className="h-5 w-5 text-rausch" />}
              </div>
              <p className="mt-1 text-sm text-muted">Manage, edit and publish your properties.</p>
            </div>
            <Link href="/host/new" className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-rausch px-5 py-2.5 text-sm font-semibold text-white hover:bg-rausch-active sm:self-auto">
              <Plus className="h-4 w-4" /> Create listing
            </Link>
          </div>
          <HostMetrics listings={listings} reservations={reservations} />
          <HostListingsSection listings={listings} onToggleActive={handleToggleActive} onEdit={setEditingListing} onDelete={setDeletingListing} />
        </main>
      ) : activeTab === "calendar" ? (
        <main id="calendar" className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10"><HostCalendar listings={listings} /></main>
      ) : (
        <main id="messages" className="mx-auto flex min-h-[calc(100vh-81px)] max-w-xl flex-col items-center justify-center px-6 pb-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-soft"><MessageSquare className="h-8 w-8 text-muted" /></span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink">No new messages</h1>
          <p className="mt-3 text-base text-muted">Messages from guests will appear here.</p>
        </main>
      )}

      {/* Edit Listing Modal */}
      <HostEditModal
        listing={editingListing}
        isOpen={Boolean(editingListing)}
        onClose={() => setEditingListing(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Listing Modal */}
      <HostDeleteDialog
        listing={deletingListing}
        isOpen={Boolean(deletingListing)}
        onClose={() => setDeletingListing(null)}
        onConfirm={handleDeleteListing}
      />
    </div>
  );
}
