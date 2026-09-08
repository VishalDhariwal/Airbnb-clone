"use client";

import { Modal } from "@/components/ui/Modal";
import React, { useState } from "react";
import { HostListing } from "@/lib/types/host";
import { AlertTriangle, Loader2 } from "lucide-react";

interface HostDeleteDialogProps {
  listing: HostListing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export function HostDeleteDialog({
  listing,
  isOpen,
  onClose,
  onConfirm,
}: HostDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !listing) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm(listing.id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete listing";
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasBookings = (listing.total_reservations || 0) > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="space-y-4 p-6">
        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-base font-semibold text-ink">
            Delete {listing.title}?
          </h3>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            {hasBookings
              ? "This property has existing or past reservations. To protect guest records and payouts, it will be safely unlisted (hidden from guest searches) rather than permanently wiped."
              : "This property has no bookings. It will be permanently removed from your account and search results."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-soft rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{hasBookings ? "Unlist property" : "Delete permanently"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
