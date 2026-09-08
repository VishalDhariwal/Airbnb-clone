"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grip } from "lucide-react";
import { ListingPhoto } from "@/lib/types";
import { CloseIcon } from "@/components/ui/Icons";
import { easeStandard, fadeBase, springFast, tapScaleSubtle } from "@/lib/motion";

interface PhotoMosaicProps {
  photos: ListingPhoto[];
  title: string;
}

const FALLBACK: ListingPhoto = {
  id: 0,
  url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
  position: 0,
};

/**
 * The 1-large + 4-small photo grid (reference 14) and its full-screen gallery (15).
 *
 * Tiles dim rather than zoom on hover — a zoom inside a hard-clipped grid cell reads
 * as a glitch. The gallery slides horizontally and supports arrow keys.
 */
export function PhotoMosaic({ photos, title }: PhotoMosaicProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  const displayPhotos = photos.length > 0 ? photos : [FALLBACK];
  const count = displayPhotos.length;

  const paginate = useCallback(
    (delta: number) => setIndex(([i]) => [(i + delta + count) % count, delta]),
    [count]
  );

  const open = (i: number) => {
    setIndex([i, 0]);
    setIsGalleryOpen(true);
  };

  useEffect(() => {
    if (!isGalleryOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsGalleryOpen(false);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isGalleryOpen, paginate]);

  return (
    <section className="relative my-4">
      <div className="grid h-[340px] grid-cols-1 gap-2 overflow-hidden rounded-md sm:h-[420px] md:h-[480px] md:grid-cols-4">
        <Tile
          photo={displayPhotos[0]}
          alt={`${title} — main photo`}
          onClick={() => open(0)}
          className="md:col-span-2"
        />
        <div className="col-span-2 hidden h-full grid-cols-2 gap-2 md:grid">
          {displayPhotos.slice(1, 5).map((photo, i) => (
            <Tile
              key={photo.id || i}
              photo={photo}
              alt={`${title} — photo ${i + 2}`}
              onClick={() => open(i + 1)}
            />
          ))}
        </div>
      </div>

      <motion.button
        onClick={() => open(0)}
        whileHover={{ scale: 1.02 }}
        whileTap={tapScaleSubtle}
        transition={springFast}
        className="absolute bottom-5 right-5 flex items-center gap-2 rounded-lg border border-ink bg-white px-3.5 py-2 t-button-sm font-semibold text-ink"
      >
        <Grip className="h-3.5 w-3.5" />
        Show all photos
      </motion.button>

      {/* ------------------------- Gallery ------------------------- */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-black p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeBase}
          >
            <div className="flex items-center justify-between pb-4 text-white">
              <motion.button
                onClick={() => setIsGalleryOpen(false)}
                whileTap={{ scale: 0.9 }}
                transition={springFast}
                className="rounded-full p-2 transition-colors duration-150 hover:bg-white/10"
                aria-label="Close gallery"
              >
                <CloseIcon className="h-4 w-4" />
              </motion.button>
              <span className="t-body-sm tabular-nums">
                {index + 1} / {count}
              </span>
              <span className="w-8" />
            </div>

            <div className="relative flex max-h-[80vh] flex-1 items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={index}
                  src={displayPhotos[index].url}
                  alt={`${title} — photo ${index + 1}`}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 80 : direction < 0 ? -80 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
                  transition={{ duration: 0.3, ease: easeStandard }}
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              </AnimatePresence>

              {count > 1 && (
                <>
                  <GalleryArrow side="left" onClick={() => paginate(-1)} />
                  <GalleryArrow side="right" onClick={() => paginate(1)} />
                </>
              )}
            </div>

            <div className="pt-4 text-center t-body-sm text-white/70">
              {displayPhotos[index].caption || title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Tile({
  photo,
  alt,
  onClick,
  className = "",
}: {
  photo: ListingPhoto;
  alt: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-full overflow-hidden ${className}`}
    >
      <img
        src={photo.url}
        alt={alt}
        className="h-full w-full object-cover transition-[filter] duration-200 group-hover:brightness-90"
      />
    </button>
  );
}

function GalleryArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={springFast}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors duration-150 hover:bg-white/20 ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}
