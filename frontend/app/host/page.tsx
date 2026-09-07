"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { api } from "@/lib/api";
import { HostListing, HostReservation } from "@/lib/types/host";
import { HostMetrics } from "@/components/host/HostMetrics";
import { HostListingsSection } from "@/components/host/HostListingsSection";
import { HostReservationsTable } from "@/components/host/HostReservationsTable";
import { HostEditModal } from "@/components/host/HostEditModal";
import { HostDeleteDialog } from "@/components/host/HostDeleteDialog";
import { HostEmptyState } from "@/components/host/HostEmptyState";
import { HostDashboardSkeleton } from "@/components/ui/Skeleton";
import { Plus, Sparkles, Building2, Calendar, Loader2 } from "lucide-react";

export default function HostDashboardPage() {
  const { user, loading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "reservations">("overview");
  const [listings, setListings] = useState<HostListing[]>([]);
  const [reservations, setReservations] = useState<HostReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [editingListing, setEditingListing] = useState<HostListing | null>(null);
  const [deletingListing, setDeletingListing] = useState<HostListing | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [listingsData, reservationsData] = await Promise.all([
        api.get<HostListing[]>("/host/listings"),
        api.get<HostReservation[]>("/host/reservations"),
      ]);
      setListings(listingsData || []);
      setReservations(reservationsData || []);
    } catch (err) {
      console.error("Failed to fetch host data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.is_host) {
      fetchData();
    }
  }, [user, fetchData]);

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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Greeting & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            {user.is_superhost && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rausch bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                <Sparkles className="w-3 h-3" />
                <span>Superhost</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Manage your listings, calendar availability, and guest reservations.
          </p>
        </div>

        <Link
          href="/host/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-rausch hover:bg-rausch-hover text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create listing</span>
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-6 border-b border-hairline">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition relative ${
            activeTab === "overview"
              ? "text-ink border-b-2 border-ink"
              : "text-muted hover:text-ink"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Listings & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("reservations")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition relative ${
            activeTab === "reservations"
              ? "text-ink border-b-2 border-ink"
              : "text-muted hover:text-ink"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Reservations ({reservations.length})</span>
        </button>
      </div>

      {/* Main Content Body */}
      {isLoading ? (
        <HostDashboardSkeleton />
      ) : activeTab === "overview" ? (
        <div className="space-y-8">
          <HostMetrics listings={listings} reservations={reservations} />
          <div className="pt-4">
            <h2 className="text-lg font-bold text-ink mb-4">Your Properties</h2>
            <HostListingsSection
              listings={listings}
              onToggleActive={handleToggleActive}
              onEdit={(l) => setEditingListing(l)}
              onDelete={(l) => setDeletingListing(l)}
            />
          </div>
        </div>
      ) : (
        <HostReservationsTable reservations={reservations} />
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
