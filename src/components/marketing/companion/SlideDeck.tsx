"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  id: string;
  content: React.ReactNode;
  /** Optional full-bleed CSS background for this slide (e.g. a soft gradient wash). */
  background?: string;
}

const SWIPE_THRESHOLD = 50;

/**
 * SlideDeck
 *
 * Fully click-driven — no scrolling at all. One slide fills the screen at
 * a time; "Next" swaps to the next slide in place, the previous one exits.
 *
 * Navigation, beyond the Next/Back buttons:
 * - Progress dots are clickable — jump straight to any slide instead of
 *   being forced through every one in order.
 * - A "Skip to sign up" link appears once you're a couple slides in, for
 *   anyone who already knows they want the CTA.
 * - Arrow keys (desktop) and horizontal swipe (touch) also advance/go back.
 */
export function SlideDeck({ slides }: { slides: Slide[] }) {
  // Deep-linkable via ?slide=services — lets other pages send visitors
  // back to a specific slide instead of always the first one.
  const searchParams = useSearchParams();
  const requestedSlide = searchParams.get("slide");
  const [index, setIndex] = React.useState(() => {
    const i = slides.findIndex((s) => s.id === requestedSlide);
    return i >= 0 ? i : 0;
  });
  const slide = slides[index];
  const isFirst = index === 0;
  const isLast = index === slides.length - 1;
  const touchStartX = React.useRef<number | null>(null);

  const goNext = React.useCallback(() => {
    setIndex((i) => Math.min(i + 1, slides.length - 1));
  }, [slides.length]);

  const goBack = React.useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goBack]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -SWIPE_THRESHOLD) goNext();
    if (delta > SWIPE_THRESHOLD) goBack();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full h-dvh overflow-hidden bg-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress dots — clickable, jump directly to any slide */}
      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}: ${s.id}`}
            className="p-1.5 -m-1.5"
          >
            <span
              className={`block h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-blue-600" : "w-1.5 bg-black/15 hover:bg-black/30"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Skip to CTA, once the visitor is a couple slides in */}
      {index >= 2 && !isLast && (
        <button
          type="button"
          onClick={() => setIndex(slides.length - 1)}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 font-alt text-xs sm:text-sm text-[#5B6472] hover:text-[#0E1116] transition-colors"
        >
          Skip to sign up →
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          id={slide.id}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="absolute inset-0 overflow-y-auto flex items-start sm:items-center justify-center px-3 sm:px-6 pt-20 sm:pt-16 pb-24"
          style={slide.background ? { background: slide.background } : undefined}
        >
          <div className="w-full">{slide.content}</div>
        </motion.div>
      </AnimatePresence>

      {/* Nav controls */}
      <div className="absolute bottom-4 sm:bottom-8 right-3 sm:right-8 z-50 flex items-center gap-2 sm:gap-3">
        {!isFirst && (
          <button
            type="button"
            onClick={goBack}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-black/15 bg-white shadow-sm flex items-center justify-center text-[#0E1116] hover:border-blue-400 hover:text-blue-600 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={goNext}
            className="h-10 sm:h-12 px-4 sm:px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-alt text-sm sm:text-base font-semibold flex items-center gap-2 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
