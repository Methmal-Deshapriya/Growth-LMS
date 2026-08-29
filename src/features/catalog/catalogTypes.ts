export type LearningServiceSlug = string;
export type LearningServiceType = string;
export type CourseLevel =
  "OPEN" | "FOUNDATION" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface PublicLearningService {
  id: string;
  key: string;
  slug: string;
  title: string;
  description: string;
  accessType: "FREE" | "PAID";
  courseMode: "SEASONAL" | "EVERGREEN";
  enrollmentMode: "ADMIN" | "SELF";
  paymentRequirement: "REQUIRED" | "NOT_REQUIRED";
  sortOrder: number;
  categoryCount: number;
}

export interface PublicCategory {
  id: string;
  serviceId: string;
  serviceType: LearningServiceType;
  serviceSlug: LearningServiceSlug;
  serviceTitle: string;
  slug: string;
  title: string;
  description: string;
  audienceLabel: string;
  visualKey: string;
  badgeLabel: string | null;
  sortOrder: number;
  courseCount: number;
  levelSummary: string | null;
}

export interface PublicCourseCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: CourseLevel;
  levelLabel: string;
  durationValue: number | null;
  durationUnit: string | null;
  durationLabel: string | null;
  accessType: "FREE" | "PAID";
  instanceKind: "SEASONAL" | "EVERGREEN";
  price: number;
  currency: string;
  certificateEnabled: boolean;
}

export interface PublicCategoryDetail extends PublicCategory {
  courses: PublicCourseCard[];
}

export interface PublicCourseDetail extends PublicCourseCard {
  description: string;
  highlights: string[];
  skills: string[];
  prerequisites: string[];
  thumbnailUrl: string | null;
  category: PublicCategory;
}

export interface PublicServiceCatalog {
  serviceId: string;
  serviceType: LearningServiceType;
  serviceSlug: LearningServiceSlug;
  categoryCount: number;
  categories: PublicCategory[];
}
