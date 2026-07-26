"use client";

import React from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface PinnedSlideProps {
  children: React.ReactNode;
  className?: string;
  /** How many viewport-heights of scroll this slide's crossfade takes. */
  heightVh?: number;
  /** The last slide has nothing after it, so it doesn't need an exit transform. */
  isLast?: boolean;
}

/**
 * PinnedSlide
 *
 * The viewport doesn't visually scroll past this section — it stays put
 * (position: sticky) while the user's scroll input instead drives this
 * slide fading/shrinking away, revealing the next slide underneath in the
 * same window. Each slide gets `heightVh` of actual scrollable document
 * height as its "runway" for that transition to play out over.
 */
export function PinnedSlide({ children, className, heightVh = 160, isLast = false }: PinnedSlideProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1, 1.06]);
  const y = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0, -50]);

  return (
    <div ref={ref} style={{ height: isLast ? "100vh" : `${heightVh}vh` }} className="relative">
      <motion.div
        style={isLast ? undefined : { opacity, scale, y }}
        className={`sticky top-0 h-screen w-full flex items-center justify-center overflow-y-auto ${className ?? ""}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
