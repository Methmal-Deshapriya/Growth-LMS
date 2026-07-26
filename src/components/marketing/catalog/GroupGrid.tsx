"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { CATALOG_GRADIENT_BG } from "./background";
import { PageSlide } from "./PageSlide";
import type { CatalogSection } from "./types";

export function GroupGrid({ section }: { section: CatalogSection }) {
  return (
    <PageSlide
      background={CATALOG_GRADIENT_BG}
      backHref="/?slide=services"
      backLabel="Home"
      crumbs={[
        { label: "Home", href: "/?slide=services" },
        { label: section.eyebrow, href: section.basePath, current: true },
      ]}
    >
      <div className="w-full max-w-5xl mx-auto px-2">
        <Reveal className="max-w-2xl mb-8 sm:mb-10">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0E1116] leading-tight tracking-tight">
            {section.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
              {section.highlight}
            </span>
          </h1>
          <p className="font-alt text-[#5B6472] text-sm sm:text-base mt-3 sm:mt-4">{section.subtitle}</p>
        </Reveal>

        <Reveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {section.groups.map((group) => {
            const Icon = group.icon;
            return (
              <RevealItem key={group.slug}>
                <Link
                  href={`${section.basePath}/${group.slug}`}
                  className="group flex flex-col h-full bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${group.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-sans font-semibold text-lg text-[#0E1116]">{group.title}</h3>
                  </div>

                  <p className="font-alt text-sm text-[#5B6472] mb-4 leading-snug">{group.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="font-alt text-xs text-[#5B6472] bg-[#F5F6FA] border border-black/5 rounded-full px-2.5 py-1">
                      {group.courses.length} course{group.courses.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-end pt-3 border-t border-black/5">
                    <span className="flex items-center gap-1 font-alt text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                      Explore <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </PageSlide>
  );
}
