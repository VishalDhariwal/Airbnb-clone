"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ListingDetail, ReviewListResponse } from "@/lib/types";
import { PhotoMosaic } from "@/components/room/PhotoMosaic";
import { RoomHeader } from "@/components/room/RoomHeader";
import { PropertySubheader } from "@/components/room/PropertySubheader";
import { GuestFavoriteBanner } from "@/components/room/GuestFavoriteBanner";
import { HostProfileBar } from "@/components/room/HostProfileBar";
import { RoomHighlights } from "@/components/room/RoomHighlights";
import { RoomAmenities } from "@/components/room/RoomAmenities";
import { WhereYouSleep } from "@/components/room/WhereYouSleep";
import { RoomCalendarSection } from "@/components/room/RoomCalendarSection";
import { BookingWidget } from "@/components/room/BookingWidget";
import { RoomReviews } from "@/components/room/RoomReviews";
import { StickyRoomNav } from "@/components/room/StickyRoomNav";
import { RoomDetailSkeleton } from "@/components/ui/Skeleton";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId || isNaN(listingId)) {
      setError("Invalid listing ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      api.get<ListingDetail>(`/listings/${listingId}`),
      api.get<ReviewListResponse>(`/listings/${listingId}/reviews`).catch(() => null),
    ])
      .then(([listingRes, reviewsRes]) => {
        setListing(listingRes);
        setReviewsData(reviewsRes);
      })
      .catch((err) => {
        setError(err?.message || "Listing not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [listingId]);

  if (loading) {
    return <RoomDetailSkeleton />;
  }

  if (error || !listing) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink mb-2">Listing not found</h1>
        <p className="text-sm text-muted mb-6">{error || "The requested listing could not be found."}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-ink text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          Return to home
        </button>
      </div>
    );
  }

  const handleReserveScroll = () => {
    const el = document.getElementById("booking-widget");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation Bar when scrolling past photos */}
      <StickyRoomNav
        nightlyRate={listing.price_per_night}
        avgRating={listing.avg_rating}
        reviewCount={listing.review_count}
        onReserve={handleReserveScroll}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 py-6">
        {/* Title and Action Buttons */}
        <div id="room-header">
          <RoomHeader listing={listing} />
        </div>

        {/* 5-Photo Mosaic & Gallery Modal */}
        <PhotoMosaic photos={listing.photos} title={listing.title} />

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 items-start">
          {/* Left Column: Property Details, Highlights, Where you'll sleep, Calendar, & Reviews */}
          <div className="lg:col-span-7 xl:col-span-8">
            <PropertySubheader listing={listing} />

            {listing.is_guest_favorite && (
              <GuestFavoriteBanner
                avgRating={listing.avg_rating}
                reviewCount={listing.review_count}
              />
            )}

            <HostProfileBar host={listing.host} />

            <RoomHighlights listing={listing} />

            <RoomAmenities
              description={listing.description}
              amenities={listing.amenities}
              amenitiesGrouped={listing.amenities_grouped}
            />

            {/* Where you'll sleep */}
            <WhereYouSleep photos={listing.photos} />

            {/* Calendar Section */}
            <RoomCalendarSection city={listing.city} />

            {/* Reviews Section with Hero & Mentions */}
            <RoomReviews
              reviews={reviewsData?.items || []}
              total={reviewsData?.total ?? listing.review_count}
              ratingAverages={reviewsData?.rating_averages}
              avgRating={listing.avg_rating}
              host={listing.host}
            />
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div id="booking-widget" className="lg:col-span-5 xl:col-span-4">
            <BookingWidget
              listingId={listing.id}
              nightlyRate={listing.price_per_night}
              cleaningFee={listing.cleaning_fee}
              maxGuests={listing.max_guests}
              avgRating={listing.avg_rating}
              reviewCount={listing.review_count}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
