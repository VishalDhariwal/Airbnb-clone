"use client";

import React, { useEffect, useState } from "react";
import { ListingPhoto } from "@/lib/types";
import { CloseIcon } from "@/components/ui/Icons";

interface PhotoMosaicProps {
  photos: ListingPhoto[];
  title: string;
}

export function PhotoMosaic({ photos, title }: PhotoMosaicProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const displayPhotos = photos.length > 0
    ? photos
    : [{ id: 0, url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80", position: 0 }];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isGalleryOpen) return;
      if (e.key === "Escape") setIsGalleryOpen(false);
      if (e.key === "ArrowRight") setActivePhotoIdx((prev) => (prev + 1) % displayPhotos.length);
      if (e.key === "ArrowLeft")
        setActivePhotoIdx((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, displayPhotos.length]);

  return (
    <section className="relative my-4">
      {/* 5-Photo Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[340px] sm:h-[420px] md:h-[480px]">
        {/* Main Hero Photo (Left 50%) */}
        <div
          onClick={() => {
            setActivePhotoIdx(0);
            setIsGalleryOpen(true);
          }}
          className="md:col-span-2 h-full cursor-pointer overflow-hidden group relative"
        >
          <img
            src={displayPhotos[0].url}
            alt={`${title} - Main photo`}
            className="w-full h-full object-cover group-hover:brightness-90 transition duration-200"
          />
        </div>

        {/* 4 Smaller Photos (Right 2x2 Grid) */}
        <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
          {displayPhotos.slice(1, 5).map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => {
                setActivePhotoIdx(idx + 1);
                setIsGalleryOpen(true);
              }}
              className="h-full cursor-pointer overflow-hidden group relative"
            >
              <img
                src={photo.url}
                alt={`${title} - Photo ${idx + 2}`}
                className="w-full h-full object-cover group-hover:brightness-90 transition duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Show All Photos Floating Button */}
      <button
        onClick={() => {
          setActivePhotoIdx(0);
          setIsGalleryOpen(true);
        }}
        className="absolute bottom-5 right-5 bg-white/95 hover:bg-white text-ink font-semibold text-xs py-2 px-3.5 rounded-lg border border-ink shadow-md flex items-center gap-2 backdrop-blur-sm hover:scale-105 active:scale-95 transition"
      >
        <span>⊞</span>
        <span>Show all {displayPhotos.length} photos</span>
      </button>

      {/* Full-Screen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-4">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Close gallery"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              {activePhotoIdx + 1} / {displayPhotos.length}
            </span>
            <div className="w-8" />
          </div>

          {/* Main Photo View */}
          <div className="relative flex-1 flex items-center justify-center max-h-[80vh]">
            <img
              src={displayPhotos[activePhotoIdx].url}
              alt={`${title} - Photo ${activePhotoIdx + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg"
            />

            {/* Prev / Next Chevrons */}
            {displayPhotos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhotoIdx(
                      (prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActivePhotoIdx((prev) => (prev + 1) % displayPhotos.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Caption */}
          <div className="text-center text-white/80 text-xs pt-4">
            {displayPhotos[activePhotoIdx].caption || title}
          </div>
        </div>
      )}
    </section>
  );
}
