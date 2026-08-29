"use client";

import type {
  LearningServiceSlug,
  PublicCategory,
  PublicLearningService,
} from "@/features/catalog/catalogTypes";
import { catalogVisual } from "../catalog/visuals";
import { PublicServicePage } from "./PublicServicePage";
import { itBootcampsServiceConfig } from "@/data/publicServices/itBootcamps";
import { pretechServiceConfig } from "@/data/publicServices/pretech";
import { contributionsServiceConfig } from "@/data/publicServices/contributions";
import type { PublicServiceConfig } from "./types";

const CONFIGS: Record<string, PublicServiceConfig> = {
  bootcamps: itBootcampsServiceConfig,
  "pretech-courses": pretechServiceConfig,
  "free-learning": contributionsServiceConfig,
};

const COLORS = [
  ["from-violet-500 to-violet-600", "text-violet-600"],
  ["from-blue-500 to-blue-600", "text-blue-600"],
  ["from-cyan-500 to-cyan-600", "text-cyan-600"],
  ["from-orange-500 to-orange-600", "text-orange-600"],
];

export function ServiceLanding({
  service,
  categories,
  definition,
}: {
  service: LearningServiceSlug;
  categories: PublicCategory[];
  definition?: PublicLearningService;
}) {
  const source = CONFIGS[service] ?? {
    ...itBootcampsServiceConfig,
    breadcrumbLabel:
      definition?.title ??
      service
        .split("-")
        .map((part) => part[0]?.toUpperCase() + part.slice(1))
        .join(" "),
    hero: {
      ...itBootcampsServiceConfig.hero,
      eyebrow: "Learning service",
      title: definition?.title ?? "Explore",
      highlight: "learning pathways",
      description:
        definition?.description ?? itBootcampsServiceConfig.hero.description,
      illustration: undefined,
    },
    categorySection: {
      ...itBootcampsServiceConfig.categorySection,
      title: "Choose a",
      highlight: "learning category",
      itemLabel: "categories",
    },
  };
  const config = {
    ...source,
    basePath: `/${service}`,
    hero: {
      ...source.hero,
      indicators: source.hero.indicators.map((indicator, index) =>
        index === 0
          ? { ...indicator, label: `${categories.length} learning categories` }
          : indicator,
      ),
    },
    categorySection: {
      ...source.categorySection,
      items: categories.map((category, index) => {
        const [iconGradient, accentText] = COLORS[index % COLORS.length];
        return {
          id: category.id,
          title: category.title,
          description: category.description,
          href: `/${service}/${category.slug}`,
          icon: catalogVisual(category.visualKey),
          iconGradient,
          accentText,
          badge:
            category.badgeLabel ??
            (category.courseCount === 0 ? "Coming soon" : undefined),
          metadata: [
            category.courseCount === 0
              ? "Courses coming soon"
              : `${category.courseCount} ${category.courseCount === 1 ? "course" : "courses"}`,
            category.levelSummary ?? category.audienceLabel,
          ],
        };
      }),
    },
  };
  return <PublicServicePage config={config} />;
}
