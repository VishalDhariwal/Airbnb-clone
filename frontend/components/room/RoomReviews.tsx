"use client";

import React from "react";
import { HostSummary, Review } from "@/lib/types";
import { ReviewsRatingHero } from "./ReviewsRatingHero";
import { ReviewsMentionPills } from "./ReviewsMentionPills";
import { RoomReviewsList } from "./RoomReviewsList";

interface RoomReviewsProps {
  reviews: Review[];
  total: number;
  ratingAverages?: {
    cleanliness?: number;
    accuracy?: number;
    check_in?: number;
    communication?: number;
    location?: number;
    value?: number;
  };
  avgRating?: number;
  host: HostSummary;
}

export function RoomReviews({
  reviews,
  total,
  ratingAverages,
  avgRating = 4.95,
}: RoomReviewsProps) {
  return (
    <div id="reviews-section" className="py-8 space-y-8 border-b border-hairline">
      {/* 4.95 Guest Favourite Hero with 7 Column Subratings */}
      <ReviewsRatingHero avgRating={avgRating} ratingAverages={ratingAverages} />

      {/* Mention Filter Chips */}
      <ReviewsMentionPills />

      {/* 2-Column Review Grid & Show all Button */}
      <RoomReviewsList reviews={reviews} total={total} />
    </div>
  );
}
