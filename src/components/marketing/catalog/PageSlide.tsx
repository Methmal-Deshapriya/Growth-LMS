"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href: string;
  /** The page you're currently on — rendered highlighted and not a link. */
  current?: boolean;
}

/**
 * PageSlide
 *
 * The same full-screen shell as the home page's SlideDeck (h-dvh, no
 * navbar/footer, same content padding/centering), for pages that only have
 * one screen to show rather than several to page through. The Back button
 * matches SlideDeck's Next button exactly (same blue pill, same size), and
 * the breadcrumb sits where SlideDeck's own chrome (progress dots/skip
 * link) lives, for jumping back more than one level.
 */
export function PageSlide({
  children,
  backHref,
  backLabel = "Home",
  background,
  crumbs,
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  background?: string;
  crumbs?: Crumb[];
}) {
  return (
    <div className="relative w-full h-dvh overflow-hidden bg-white">
      {crumbs && crumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="absolute top-4 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 flex-wrap font-alt text-xs sm:text-sm"
        >
          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href + crumb.label}>
              {i > 0 && <span className="text-[#0E1116]/25">/</span>}
              {crumb.current ? (
                <span aria-current="page" className="flex items-center gap-1 font-semibold text-blue-600">
                  {i === 0 && <Home className="h-3.5 w-3.5" />}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="flex items-center gap-1 font-medium text-[#5B6472] hover:text-blue-600 transition-colors"
                >
                  {i === 0 && <Home className="h-3.5 w-3.5" />}
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div
        className="absolute inset-0 overflow-y-auto flex items-start sm:items-center justify-center px-3 sm:px-6 pt-20 sm:pt-16 pb-24"
        style={background ? { background } : undefined}
      >
        <div className="w-full">{children}</div>
      </div>

      {backHref && (
        <div className="absolute bottom-4 sm:bottom-8 right-3 sm:right-8 z-50">
          <Link
            href={backHref}
            aria-label={`Back to ${backLabel}`}
            className="h-10 sm:h-12 px-4 sm:px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-alt text-sm sm:text-base font-semibold flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      )}
    </div>
  );
}
