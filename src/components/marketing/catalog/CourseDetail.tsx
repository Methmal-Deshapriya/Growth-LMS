"use client";

import React from "react";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CATALOG_GRADIENT_BG } from "./background";
import { PageSlide } from "./PageSlide";
import { ContactCTAButton } from "./ContactCTAButton";
import type { CatalogCourse, CatalogGroup, CatalogSection } from "./types";

export function CourseDetail({
  section,
  group,
  course,
}: {
  section: CatalogSection;
  group: CatalogGroup;
  course: CatalogCourse;
}) {
  const Icon = group.icon;

  return (
    <PageSlide
      background={CATALOG_GRADIENT_BG}
      backHref={`${section.basePath}/${group.slug}`}
      backLabel={group.title}
      crumbs={[
        { label: "Home", href: "/?slide=services" },
        { label: section.eyebrow, href: section.basePath },
        { label: group.title, href: `${section.basePath}/${group.slug}` },
        { label: course.title, href: `${section.basePath}/${group.slug}/${course.slug}`, current: true },
      ]}
    >
      <div className="w-full max-w-3xl mx-auto px-2">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${group.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#0E1116] leading-tight tracking-tight">
              {course.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="font-alt text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
              {course.level}
            </span>
            <span className="font-alt text-xs text-[#5B6472] bg-[#F5F6FA] border border-black/5 rounded-full px-2.5 py-1">
              {course.duration}
            </span>
          </div>

          <p className="font-alt text-[#5B6472] text-base leading-relaxed mb-8 max-w-2xl">
            {course.description}
          </p>

          <div className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-6 mb-8">
            <h2 className="font-sans font-semibold text-lg text-[#0E1116] mb-4">What you&apos;ll cover</h2>
            <ul className="space-y-3">
              {course.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 font-alt text-sm text-[#5B6472]">
                  <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <ContactCTAButton
            message={`Hello! I'm interested in ${course.title}.`}
            label="Get in touch about this course"
          />
        </Reveal>
      </div>
    </PageSlide>
  );
}
