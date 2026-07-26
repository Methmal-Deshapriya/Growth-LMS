"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * ScrollBackdrop
 *
 * A fixed layer behind the whole landing page that shifts from a dark,
 * molten gradient at the hero to a clean, resolved steel-white by the
 * final CTA — the page's "transformation" throughline. This is a single,
 * deliberate visual world for the marketing narrative, independent of the
 * app's dark/light mode toggle — sections render fixed text colors suited
 * to their position on this gradient (light text early, dark text late)
 * rather than the theme-reactive foreground/background tokens used
 * elsewhere in the app.
 *
 * Roughly: Hero/Introduction sit in the dark zone, Proof/Advice/BootCamps
 * cross through the brand-blue "heat" zone, Mentors/Careers/FinalCTA
 * resolve to the light zone.
 *
 * Visitors who prefer reduced motion get the fully-resolved end state
 * immediately, with no scroll-linked interpolation.
 */
export function ScrollBackdrop() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  const background = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.6, 0.78, 1],
    [
      "#0B0D12",
      "#12182B",
      "#17233C",
      "#1D3A6E",
      "#EAF0FF",
      "#F4F5F7",
    ]
  );

  // Deliberately z-0, not a negative z-index: negative values render behind
  // an ancestor's own background (body/layout both set bg-background), which
  // would hide this entirely. z-0 + the content wrapper being `relative z-10`
  // in page.tsx keeps this reliably behind the actual sections instead.
  //
  // Under reduced motion this can't be a single flat color — the Hero's
  // white text needs a dark backdrop specifically, not the page's final
  // resolved light state. Instead of scroll-linking a `fixed` layer, use a
  // plain (non-animated) top-to-bottom gradient on an `absolute` layer
  // sized to the full page height, so each section still sees the correct
  // zone of the gradient as the browser scrolls it into view natively.
  if (shouldReduceMotion) {
    return (
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, #0B0D12 0%, #12182B 20%, #17233C 45%, #1D3A6E 60%, #EAF0FF 78%, #F4F5F7 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-0"
      style={{ background }}
      aria-hidden="true"
    />
  );
}
