"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { CATALOG_GRADIENT_BG } from "./background";
import { PageSlide } from "./PageSlide";
import type { CatalogGroup, CatalogSection } from "./types";

export function CourseGrid({ section, group }: { section: CatalogSection; group: CatalogGroup }) {
  const Icon = group.icon;

  return (
    <PageSlide
      background={CATALOG_GRADIENT_BG}
      backHref={section.basePath}
      backLabel={section.eyebrow}
      crumbs={[
        { label: "Home", href: "/?slide=services" },
        { label: section.eyebrow, href: section.basePath },
        { label: group.title, href: `${section.basePath}/${group.slug}`, current: true },
      ]}
    >
      <div className="w-full max-w-5xl mx-auto px-2">
        <Reveal className="flex items-start gap-4 mb-8 sm:mb-10">
          <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${group.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#0E1116] leading-tight">
              {group.title}
            </h1>
            <p className="font-alt text-[#5B6472] text-sm sm:text-base mt-1">{group.description}</p>
          </div>
        </Reveal>

        <Reveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {group.courses.map((course) => (
            <RevealItem key={course.slug}>
              <Link
                href={`${section.basePath}/${group.slug}/${course.slug}`}
                className="group flex flex-col h-full bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <h3 className="font-sans font-semibold text-lg text-[#0E1116] mb-1.5">{course.title}</h3>
                <p className="font-alt text-sm text-[#5B6472] mb-4 leading-snug">{course.summary}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="font-alt text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                    {course.level}
                  </span>
                  <span className="font-alt text-xs text-[#5B6472] bg-[#F5F6FA] border border-black/5 rounded-full px-2.5 py-1">
                    {course.duration}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-end pt-3 border-t border-black/5">
                  <span className="flex items-center gap-1 font-alt text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    View course <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </PageSlide>
  );
}
