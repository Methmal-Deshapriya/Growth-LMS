import type {
  LearningServiceSlug,
  LearningServiceType,
} from "./catalogTypes";

export interface AdminCatalogService {
  slug: LearningServiceSlug;
  type: LearningServiceType;
  label: string;
  description: string;
}

export const ADMIN_CATALOG_SERVICES: readonly AdminCatalogService[] = [
  {
    slug: "bootcamps",
    type: "BOOTCAMPS",
    label: "Bootcamps",
    description: "Paid, batch-based professional learning programs.",
  },
  {
    slug: "pretech-courses",
    type: "PRETECH",
    label: "PreTech Courses",
    description: "Paid, batch-based preparation courses.",
  },
  {
    slug: "free-learning",
    type: "FREE_LEARNING",
    label: "Free Learning",
    description: "Self-paced courses available through free enrollment.",
  },
] as const;

export function getAdminCatalogService(slug: string) {
  return ADMIN_CATALOG_SERVICES.find((service) => service.slug === slug) ?? null;
}

