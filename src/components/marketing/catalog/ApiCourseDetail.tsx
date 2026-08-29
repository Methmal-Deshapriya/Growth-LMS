"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { PublicCourseDetail } from "@/features/catalog/catalogTypes";
import { CatalogIcon } from "./visuals";
import { CATALOG_GRADIENT_BG } from "./background";
import { ContactCTAButton } from "./ContactCTAButton";
import { PageSlide } from "./PageSlide";

export function ApiCourseDetail({ course }: { course: PublicCourseDetail }) {
  const { category } = course;
  const basePath = `/${category.serviceSlug}`;
  return (
    <PageSlide
      background={CATALOG_GRADIENT_BG}
      backHref={`${basePath}/${category.slug}`}
      backLabel={category.title}
      crumbs={[
        { label: "Home", href: "/?slide=services" },
        { label: category.serviceTitle, href: basePath },
        { label: category.title, href: `${basePath}/${category.slug}` },
        {
          label: course.title,
          href: `${basePath}/${category.slug}/${course.slug}`,
          current: true,
        },
      ]}
    >
      <div className="w-full max-w-3xl mx-auto px-2">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-blue-600 bg-blue-100">
              <CatalogIcon visualKey={category.visualKey} className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0E1116]">
              {course.title}
            </h1>
          </div>
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
              {course.accessType === "FREE"
                ? "Free enrollment"
                : "Paid enrollment"}
            </span>
          </div>
          <p className="font-alt text-[#5B6472] leading-relaxed mb-8">
            {course.description}
          </p>
          <div className="bg-white/80 border border-black/10 rounded-2xl p-6 mb-8">
            <h2 className="font-semibold text-lg text-[#0E1116] mb-4">
              What you&apos;ll cover
            </h2>
            <ul className="space-y-3">
              {course.highlights.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-[#5B6472]">
                  <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {course.prerequisites.length > 0 && (
            <div className="mb-8">
              <h2 className="font-semibold text-[#0E1116] mb-2">
                Prerequisites
              </h2>
              <p className="text-sm text-[#5B6472]">
                {course.prerequisites.join(" · ")}
              </p>
            </div>
          )}
          {course.accessType === "FREE" ? (
            <Link
              href={`/?slide=auth&enrollCourse=${course.id}`}
              className="inline-flex h-11 items-center rounded-full bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700"
            >
              Sign in and add to My Courses
            </Link>
          ) : (
            <ContactCTAButton
              message={`Hello! I'm interested in ${course.title}.`}
              label="Get in touch about this course"
            />
          )}
        </Reveal>
      </div>
    </PageSlide>
  );
}
