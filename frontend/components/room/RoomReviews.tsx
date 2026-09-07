"use client";

import React from "react";
import { HostSummary, Review } from "@/lib/types";
import { StarIcon, UserAvatarIcon } from "@/components/ui/Icons";

interface RoomReviewsProps {
  reviews: Review[];
  total: number;
  ratingAverages?: {
    cleanliness: number;
    accuracy: number;
    check_in: number;
    communication: number;
    location: number;
    value: number;
  };
  host: HostSummary;
}

export function RoomReviews({
  reviews,
  total,
  ratingAverages,
  host,
}: RoomReviewsProps) {
  const categories = [
    { label: "Cleanliness", score: ratingAverages?.cleanliness ?? 4.9 },
    { label: "Accuracy", score: ratingAverages?.accuracy ?? 4.9 },
    { label: "Check-in", score: ratingAverages?.check_in ?? 5.0 },
    { label: "Communication", score: ratingAverages?.communication ?? 4.9 },
    { label: "Location", score: ratingAverages?.location ?? 4.8 },
    { label: "Value", score: ratingAverages?.value ?? 4.9 },
  ];

  return (
    <div className="py-8 space-y-8 border-b border-hairline-soft">
      {/* Overall Score Header */}
      <div className="flex items-center gap-2 text-xl font-bold text-ink">
        <StarIcon className="w-5 h-5 text-ink" />
        <span>{total > 0 ? `${categories[0].score.toFixed(2)} · ` : ""}</span>
        <span>{total} reviews</span>
      </div>

      {/* 6 Category Sub-Ratings */}
      {total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center justify-between text-sm">
              <span className="text-bodytext">{cat.label}</span>
              <div className="flex items-center gap-3">
                <div className="w-28 bg-hairline rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-ink h-1 rounded-full"
                    style={{ width: `${(cat.score / 5) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-semibold text-xs text-ink">
                  {cat.score.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {reviews.slice(0, 6).map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-soft flex items-center justify-center">
                {review.author.avatar_url ? (
                  <img
                    src={review.author.avatar_url}
                    alt={review.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserAvatarIcon className="w-6 h-6 text-muted" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{review.author.name}</p>
                <p className="text-xs text-muted">
                  {new Date(review.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p className="text-sm text-bodytext leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="h-px bg-hairline-soft" />

      {/* Host Profile Card */}
      <div className="pt-2">
        <h3 className="text-xl font-bold text-ink mb-4">Meet your Host</h3>
        <div className="p-6 rounded-2xl border border-hairline-soft bg-surface-soft max-w-xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-hairline flex items-center justify-center bg-white">
              {host.avatar_url ? (
                <img src={host.avatar_url} alt={host.name} className="w-full h-full object-cover" />
              ) : (
                <UserAvatarIcon className="w-10 h-10 text-muted" />
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-ink">{host.name}</p>
              <p className="text-xs text-muted">
                {host.is_superhost ? "Superhost · " : ""}Joined in {host.joined_year || 2024}
              </p>
            </div>
          </div>

          {host.bio && <p className="text-sm text-bodytext leading-relaxed">{host.bio}</p>}

          <div className="text-xs text-muted space-y-1 pt-2 border-t border-hairline-soft">
            <p>Response rate: {host.response_rate || 98}%</p>
            <p>Response time: within an hour</p>
          </div>
        </div>
      </div>
    </div>
  );
}
