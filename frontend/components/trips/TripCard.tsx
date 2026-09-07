"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { BookingConfirmation } from "@/lib/types";
import { CloseIcon } from "@/components/ui/Icons";

interface TripCardProps {
  booking: BookingConfirmation;
  onCancelled?: () => void;
  onCancelBooking: (id: number) => Promise<void>;
}

export function TripCard({ booking, onCancelBooking }: TripCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const listing = booking.listing;
  const cover = listing?.cover_photo || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

  const isCancelled = booking.status === "cancelled";

  async function handleConfirmCancel() {
    setIsCancelling(true);
    try {
      await onCancelBooking(booking.id);
      setIsModalOpen(false);
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-hairline-soft bg-white shadow-sm hover:shadow-md transition">
      {/* Property Thumbnail */}
      <Link
        href={`/rooms/${booking.listing_id}`}
        className="w-full sm:w-52 h-44 rounded-xl overflow-hidden flex-shrink-0 bg-surface-soft block"
      >
        <img
          src={cover}
          alt={listing?.title || "Property image"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Booking Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Status & Code */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isCancelled
                  ? "bg-neutral-100 text-muted line-through"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {booking.status}
            </span>
            <span className="text-xs font-mono font-semibold text-muted">
              Code: {booking.confirmation_code}
            </span>
          </div>

          <Link
            href={`/rooms/${booking.listing_id}`}
            className="text-lg font-bold text-ink hover:underline line-clamp-1"
          >
            {listing?.title || `Stay in ${listing?.city || "India"}`}
          </Link>
          <p className="text-xs text-muted mt-0.5">
            {listing?.property_type} in {listing?.city}, {listing?.state}
          </p>

          {/* Dates & Guests */}
          <div className="mt-3 text-sm text-bodytext space-y-0.5">
            <p className="font-semibold text-ink">
              {new Date(booking.check_in).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              –{" "}
              {new Date(booking.check_out).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-muted">
              {booking.nights} nights · {booking.adults + booking.children} guests
            </p>
          </div>
        </div>

        {/* Footer Row: Price & Actions */}
        <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-muted">Total paid: </span>
            <span className="text-sm font-bold text-ink">
              {formatCurrency(booking.total_price)}
            </span>
          </div>

          {!isCancelled && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-danger hover:underline p-1"
            >
              Cancel reservation
            </button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-hairline p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-hairline-soft">
              <h3 className="text-base font-bold text-ink">Cancel reservation?</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted hover:text-ink rounded-full"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-bodytext leading-relaxed">
              Are you sure you want to cancel your stay at{" "}
              <strong>{listing?.title}</strong> ({booking.check_in} to {booking.check_out})?
            </p>

            <p className="text-xs text-muted">
              Once cancelled, the reservation dates will be freed up immediately for other guests.
            </p>

            <div className="pt-3 flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-soft rounded-lg transition"
              >
                Keep reservation
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-5 py-2 text-sm font-semibold text-white bg-danger hover:bg-danger-hover rounded-lg transition disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Confirm cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
