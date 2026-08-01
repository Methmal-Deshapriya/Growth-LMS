import type { PublicServiceConfig } from "./types";

/**
 * The one accent every Level-2 public service page shares — matches the
 * blue/indigo gradient used throughout the landing page (Services slide,
 * WelcomeSlide). Category cards within a page still get their own per-item
 * colors for variety; this is only the page-level accent (hero highlight,
 * indicator icons, CTA button).
 */
export const SERVICE_ACCENT: PublicServiceConfig["accent"] = {
  text: "text-blue-600",
  gradient: "from-blue-600 to-indigo-500",
  softBg: "bg-blue-100",
  button: "bg-blue-600 hover:bg-blue-700",
};
