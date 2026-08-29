"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Target,
  Users,
} from "lucide-react";
import { useGetPublicLearningServicesQuery } from "@/features/catalog/catalogApi";

const ICONS = [GraduationCap, BookOpen, Users];
const COLORS = [
  "text-blue-600 bg-blue-100",
  "text-indigo-600 bg-indigo-100",
  "text-orange-600 bg-orange-100",
];

export function Services() {
  const { data, isLoading, isError } = useGetPublicLearningServicesQuery();
  const learningServices = data?.services ?? [];
  const cards = learningServices.map((service, index) => ({
    href: `/${service.slug}`,
    icon: ICONS[index % ICONS.length],
    color: COLORS[index % COLORS.length],
    title: service.title,
    description: service.description,
    tags: [
      service.accessType === "FREE" ? "Free access" : "Paid access",
      service.courseMode === "EVERGREEN" ? "Self-paced" : "Seasonal intakes",
      service.enrollmentMode === "SELF"
        ? "Self enrollment"
        : "Admin enrollment",
    ],
  }));

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl px-2">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight text-[#0E1116] sm:text-4xl">
            What we{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              offer
            </span>
          </h2>
          <p className="font-alt mt-3 text-sm text-[#5B6472] sm:mt-4 sm:text-base">
            Choose a learning service or get support for a project.
          </p>
        </div>

        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="py-10 text-center text-[#5B6472]"
          >
            Loading learning services…
          </p>
        ) : null}
        {isError ? (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            Learning services could not be loaded right now.
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {cards.map(
            ({ href, icon: Icon, color, title, description, tags }) => (
              <Link
                key={href}
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-lg sm:p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans text-lg font-semibold text-[#0E1116]">
                    {title}
                  </h3>
                </div>
                <p className="font-alt mb-4 text-sm leading-snug text-[#5B6472]">
                  {description}
                </p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-alt rounded-full border border-black/5 bg-[#F5F6FA] px-2.5 py-1 text-xs text-[#5B6472]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-end border-t border-black/5 pt-3">
                  <span className="font-alt flex items-center gap-1 text-sm font-semibold text-blue-600 transition-all group-hover:gap-2">
                    Explore <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ),
          )}

          <Link
            href="/consultations"
            className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-lg sm:p-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-sans text-lg font-semibold text-[#0E1116]">
                Project Consultations
              </h3>
            </div>
            <p className="font-alt mb-4 text-sm leading-snug text-[#5B6472]">
              Guidance and support for students working through university and
              research projects.
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {[
                "University Projects",
                "Research Projects",
                "Guidance Toward Success",
              ].map((tag) => (
                <span
                  key={tag}
                  className="font-alt rounded-full border border-black/5 bg-[#F5F6FA] px-2.5 py-1 text-xs text-[#5B6472]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-end border-t border-black/5 pt-3">
              <span className="font-alt flex items-center gap-1 text-sm font-semibold text-blue-600 transition-all group-hover:gap-2">
                Explore <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Services;
