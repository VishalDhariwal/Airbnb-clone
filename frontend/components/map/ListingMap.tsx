"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatCurrency } from "@/lib/format";
import { ListingCard as ListingCardType } from "@/lib/types";

interface ListingMapProps {
  listings: ListingCardType[];
  selectedListingId?: number | null;
  onSelectListing?: (id: number | null) => void;
}

export function ListingMap({
  listings,
  selectedListingId,
  onSelectListing,
}: ListingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = [20.5937, 78.9629]; // Center of India
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 5,
        zoomControl: true,
      });

      // Use CartoDB Voyager tiles for modern Airbnb aesthetic
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const validListings = listings.filter(
      (lst) => lst.latitude != null && lst.longitude != null
    );

    if (validListings.length === 0) return;

    const bounds = L.latLngBounds([]);

    validListings.forEach((lst) => {
      const latLng: [number, number] = [lst.latitude, lst.longitude];
      bounds.extend(latLng);

      const isSelected = selectedListingId === lst.id;
      const formattedPrice = formatCurrency(lst.price_per_night);

      const customIcon = L.divIcon({
        className: "",
        html: `<div class="airbnb-price-pill ${isSelected ? "active" : ""}" id="marker-${lst.id}">${formattedPrice}</div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 15],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      // Popup content
      const cover = lst.photos?.[0]?.url || "";
      const popupHtml = `
        <div style="width: 220px; font-family: inherit;">
          ${
            cover
              ? `<img src="${cover}" alt="${lst.title}" style="width: 100%; height: 130px; object-fit: cover; display: block;" />`
              : ""
          }
          <div style="padding: 10px 12px;">
            <div style="font-weight: 600; font-size: 13px; color: #222; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${lst.city}, India
            </div>
            <div style="font-size: 11px; color: #717171; margin-top: 2px;">
              ${lst.property_type} · ★ ${lst.avg_rating > 0 ? lst.avg_rating.toFixed(2) : "New"}
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #222; margin-top: 6px;">
              ${formattedPrice} <span style="font-size: 11px; font-weight: normal; color: #717171;">night</span>
            </div>
            <a href="/rooms/${lst.id}" style="display: block; margin-top: 8px; text-align: center; background: #222; color: #fff; padding: 6px 0; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;">
              View stay
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 240 });

      marker.on("click", () => {
        onSelectListing?.(lst.id);
      });

      markersRef.current[lst.id] = marker;
    });

    if (validListings.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [listings, selectedListingId, onSelectListing]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-sm border border-hairline-soft relative z-0">
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />
    </div>
  );
}
