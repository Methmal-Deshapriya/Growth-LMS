"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import type { PublicCategoryDetail } from "@/features/catalog/catalogTypes";
import { CatalogIcon } from "./visuals";
import { CATALOG_GRADIENT_BG } from "./background";
import { PageSlide } from "./PageSlide";

export function ApiCourseGrid({
  category,
}: {
  category: PublicCategoryDetail;
}) {
  const basePath = `/${category.serviceSlug}`;
  return (
    <PageSlide
      background={CATALOG_GRADIENT_BG}
      backHref={basePath}
      backLabel="Categories"
      crumbs={[
        { label: "Home", href: "/?slide=services" },
        { label: category.serviceTitle, href: basePath },
        {
          label: category.title,
          href: `${basePath}/${category.slug}`,
          current: true,
        },
      ]}
    >
      <div className="w-full max-w-5xl mx-auto px-2">
        <Reveal className="flex items-start gap-4 mb-8 sm:mb-10">
          <div className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center text-blue-600 bg-blue-100">
            <CatalogIcon visualKey={category.visualKey} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#0E1116]">
              {category.title}
            </h1>
            <p className="font-alt text-[#5B6472] mt-1">
              {category.description}
            </p>
          </div>
        </Reveal>
        {category.courses.length === 0 ? (
          <Reveal className="rounded-3xl border border-dashed border-blue-200 bg-white/80 px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <BookOpen className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-sans text-xl font-bold text-[#0E1116] sm:text-2xl">
              No courses in this category yet
            </h2>
            <p className="mx-auto mt-2 max-w-lg font-alt text-sm leading-relaxed text-[#5B6472] sm:text-base">
              We&apos;re preparing new courses for this category. Please check
              back soon—there&apos;s more learning on the way.
            </p>
            <Link
              href={basePath}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2.5 font-alt text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Browse other categories
            </Link>
          </Reveal>
        ) : (
          <Reveal
            stagger={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {category.courses.map((course) => (
              <RevealItem key={course.id}>
                <Link
                  href={`${basePath}/${category.slug}/${course.slug}`}
                  className="group flex flex-col h-full bg-white/80 border border-black/10 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <h2 className="font-sans font-semibold text-lg text-[#0E1116] mb-1.5">
                    {course.title}
                  </h2>
                  <p className="font-alt text-sm text-[#5B6472] mb-4">
                    {course.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-xs text-blue-600 bg-blue-50 rounded-full px-2.5 py-1">
                      {course.levelLabel}
                    </span>
                    {course.durationLabel && (
                      <span className="text-xs text-[#5B6472] bg-[#F5F6FA] rounded-full px-2.5 py-1">
                        {course.durationLabel}
                      </span>
                    )}
                    <span className="text-xs text-[#5B6472] bg-[#F5F6FA] rounded-full px-2.5 py-1">
                      {course.accessType === "FREE" ? "Free" : "Paid"}
                    </span>
                  </div>
                  <span className="mt-auto pt-3 border-t border-black/5 flex justify-end items-center gap-1 text-sm font-semibold text-blue-600">
                    View course <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        )}
      </div>
    </PageSlide>
  );
}
