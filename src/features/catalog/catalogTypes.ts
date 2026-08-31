export type LearningServiceSlug = string;
export type LearningServiceType = string;
export type CourseLevel =
  "OPEN" | "FOUNDATION" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseEnrollmentStatus = "COMING_SOON" | "OPEN" | "REOPENING_SOON";

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
  /** Derived from this course's intakes — see the course-to-program rename plan §8. Drives the public CTA: OPEN shows Enroll, COMING_SOON/REOPENING_SOON show the matching waiting state. */
  enrollmentStatus: CourseEnrollmentStatus;
}

export interface PublicCategoryDetail extends PublicCategory {
  courses: PublicCourseCard[];
}

/** The course's currently OPEN_ACTIVE intake, if any — the target for Enroll/self-enroll. */
export interface PublicOpenIntake {
  id: string;
  startDate: string | null;
  expectedEndDate: string | null;
  capacity: number | null;
  /** null means unlimited capacity — distinct from 0 (full). */
  seatsRemaining: number | null;
}

export interface PublicCourseDetail extends PublicCourseCard {
  description: string;
  highlights: string[];
  skills: string[];
  prerequisites: string[];
  thumbnailUrl: string | null;
  category: PublicCategory;
  openIntake: PublicOpenIntake | null;
}

export interface PublicServiceCatalog {
  serviceId: string;
  serviceType: LearningServiceType;
  serviceSlug: LearningServiceSlug;
  categoryCount: number;
  categories: PublicCategory[];
}
