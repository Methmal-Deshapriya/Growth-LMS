export type LearningServiceSlug = "bootcamps" | "pretech-courses" | "free-learning";
export type LearningServiceType = "BOOTCAMPS" | "PRETECH" | "FREE_LEARNING";
export type CourseLevel = "OPEN" | "FOUNDATION" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseEnrollmentStatus = "COMING_SOON" | "OPEN" | "CLOSED";

export interface PublicCategory {
  id: string;
  serviceType: LearningServiceType;
  serviceSlug: LearningServiceSlug;
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
  enrollmentStatus: CourseEnrollmentStatus;
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
  serviceType: LearningServiceType;
  serviceSlug: LearningServiceSlug;
  categoryCount: number;
  categories: PublicCategory[];
}
