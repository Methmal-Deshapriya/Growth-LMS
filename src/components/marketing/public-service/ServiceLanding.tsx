"use client";

import type { LearningServiceSlug, PublicCategory } from "@/features/catalog/catalogTypes";
import { catalogVisual } from "../catalog/visuals";
import { PublicServicePage } from "./PublicServicePage";
import { itBootcampsServiceConfig } from "@/data/publicServices/itBootcamps";
import { pretechServiceConfig } from "@/data/publicServices/pretech";
import { contributionsServiceConfig } from "@/data/publicServices/contributions";

const CONFIGS = {
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
}: {
  service: LearningServiceSlug;
  categories: PublicCategory[];
}) {
  const source = CONFIGS[service];
  const config = {
    ...source,
    basePath: `/${service}`,
    hero: {
      ...source.hero,
      indicators: source.hero.indicators.map((indicator, index) =>
        index === 0 ? { ...indicator, label: `${categories.length} learning categories` } : indicator
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
          badge: category.badgeLabel ?? undefined,
          metadata: [
            `${category.courseCount} ${category.courseCount === 1 ? "course" : "courses"}`,
            category.levelSummary ?? category.audienceLabel,
          ],
        };
      }),
    },
  };
  return <PublicServicePage config={config} />;
}
