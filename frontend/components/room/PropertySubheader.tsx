"use client";

import React from "react";
import { ListingDetail } from "@/lib/types";

interface PropertySubheaderProps {
  listing: ListingDetail;
}

export function PropertySubheader({ listing }: PropertySubheaderProps) {
  const propertyTypeDisplay =
    listing.property_type?.toLowerCase() === "flat" ||
    listing.property_type?.toLowerCase() === "apartment"
      ? "rental unit"
      : listing.property_type;

  const propertyTitle = `${
    listing.room_type === "entire" || listing.room_type === "Entire place"
      ? "Entire "
      : ""
  }${propertyTypeDisplay} in ${listing.city}, ${listing.country || "India"}`;

  return (
    <div className="space-y-2">
      {/* Property Heading & Capacity Specs */}
      <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
        {propertyTitle}
      </h2>
      <p className="text-sm text-ink font-normal">
        {listing.max_guests} {listing.max_guests === 1 ? "guest" : "guests"} ·{" "}
        {listing.bedrooms} {listing.bedrooms === 1 ? "bedroom" : "bedrooms"} ·{" "}
        {listing.beds} {listing.beds === 1 ? "bed" : "beds"} ·{" "}
        {listing.bathrooms} {listing.bathrooms === 1 ? "bathroom" : "bathrooms"}
      </p>

      {/* Free cancellation pill badge */}
      <div className="pt-1">
        <span className="inline-block px-2.5 py-1 bg-surface-soft border border-hairline rounded-md text-[11px] font-medium text-ink">
          Free cancellation
        </span>
      </div>
    </div>
  );
}
