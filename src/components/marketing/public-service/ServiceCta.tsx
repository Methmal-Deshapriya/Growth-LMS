"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import type { PublicServiceConfig } from "./types";

export function ServiceCta({ ctaSection, accent }: Pick<PublicServiceConfig, "ctaSection" | "accent">) {
  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Reveal className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
      <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#0E1116] mb-2">{ctaSection.title}</h2>
      <p className="font-alt text-[#5B6472] text-sm sm:text-base mb-6 max-w-md mx-auto">{ctaSection.description}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="#categories"
          onClick={handleExploreClick}
          className={`inline-flex items-center justify-center h-12 px-6 rounded-full text-white font-alt text-sm sm:text-base font-semibold transition-colors ${accent.button}`}
        >
          {ctaSection.primaryLabel}
        </a>
        <Link
          href={ctaSection.secondaryHref}
          className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-black/15 font-alt text-sm sm:text-base font-semibold text-[#0E1116] hover:border-black/30 transition-colors"
        >
          {ctaSection.secondaryLabel}
        </Link>
      </div>
    </Reveal>
  );
}
