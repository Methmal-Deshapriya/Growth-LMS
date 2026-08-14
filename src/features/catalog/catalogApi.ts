import { baseApi } from "@/store/baseApi";
import type { LearningServiceType, CourseLevel, CourseEnrollmentStatus } from "./catalogTypes";
import type { MyEnrollment } from "@/features/enrollments/enrollmentsTypes";

export type CatalogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export interface AdminCategory {
  id: string; serviceType: LearningServiceType; slug: string; title: string;
  description: string; audienceLabel: string | null; visualKey: string;
  badgeLabel: string | null; status: CatalogStatus; sortOrder: number;
  courseCount: number; createdAt: string; updatedAt: string;
}
export interface AdminCourse {
  id: string; categoryId: string; slug: string; title: string; summary: string;
  description: string; level: CourseLevel; durationValue: number | null;
  durationUnit: "SESSION" | "DAY" | "WEEK" | "MONTH" | null;
  accessType: "FREE" | "PAID"; price: number; currency: string;
  enrollmentStatus: CourseEnrollmentStatus;
  certificateEnabled: boolean; highlights: string[]; skills: string[];
  prerequisites: string[]; thumbnailUrl: string | null; status: CatalogStatus;
  sortOrder: number; sessionCount: number; enrollmentCount: number;
  batchCount: number;
  category: AdminCategory; createdAt: string; updatedAt: string;
}
export type CategoryInput = Pick<AdminCategory, "serviceType" | "slug" | "title" | "description" | "visualKey"> & Partial<Pick<AdminCategory, "audienceLabel" | "badgeLabel" | "sortOrder">>;
export type CategoryUpdateInput = Partial<Omit<CategoryInput, "serviceType">>;
export type CourseInput = Pick<AdminCourse, "categoryId" | "slug" | "title" | "summary" | "description" | "level" | "accessType" | "price" | "certificateEnabled"> & Partial<Pick<AdminCourse, "durationValue" | "durationUnit" | "highlights" | "skills" | "prerequisites" | "thumbnailUrl" | "sortOrder">>;
export type CourseUpdateInput = Partial<Omit<CourseInput, "certificateEnabled" | "categoryId">>;
type List<T, K extends string> = Record<K, T[]> & { pagination: { total: number; limit: number; offset: number } };
export interface PermanentDeleteResult {
  id: string;
  deletedCourses: number;
  deletedBatches: number;
  deletedBatchSessions: number;
  deletedCourseSessions: number;
  deletedExclusiveSessions: number;
  preservedReusableSessions: number;
  deletedEnrollments: number;
  deletedCompletions: number;
  deletedCertificates: number;
  deletedProjects: number;
}

export interface CatalogDeletionImpact {
  resourceType: "CATEGORY" | "COURSE";
  resourceId: string;
  status: CatalogStatus;
  canDelete: boolean;
  summary: {
    courses: number;
    unarchivedCourses: number;
    batches: number;
    operationalBatches: number;
    enrollments: number;
    completions: number;
    certificates: number;
    projects: number;
    curriculumLinks: number;
    exclusiveSessions: number;
    reusableSessions: number;
  };
  blockers: Array<{
    code:
      | "RESOURCE_NOT_ARCHIVED"
      | "UNARCHIVED_COURSES"
      | "OPERATIONAL_BATCHES"
      | "ENROLLMENT_HISTORY"
      | "COMPLETION_HISTORY"
      | "CERTIFICATE_HISTORY"
      | "PROJECT_HISTORY";
    count: number;
    message: string;
  }>;
}

export interface AdminLearningServiceSummary {
  serviceType: LearningServiceType;
  serviceSlug: "bootcamps" | "pretech-courses" | "free-learning";
  label: string;
  description: string;
  deliveryMode: "COHORT" | "SELF_PACED";
  enrollmentMode: "ADMIN" | "SELF";
  categories: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  courses: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    withoutSessions: number;
  };
  learners: {
    activeUnique: number;
    totalUnique: number;
    activeEnrollments: number;
  };
  curriculumAttachmentCount: number;
  batches: {
    enrolling: number;
    active: number;
    completed: number;
  } | null;
  payments: { needsAttention: number } | null;
  attentionCount: number;
}

export const catalogApi = baseApi.injectEndpoints({ endpoints: (builder) => ({
  getAdminLearningServiceSummaries: builder.query<{ services: AdminLearningServiceSummary[] }, void>({ query: () => "/services/summary", providesTags: ["Services"] }),
  getAdminCategories: builder.query<List<AdminCategory, "categories">, { serviceType?: LearningServiceType } | void>({ query: (params) => ({ url: "/categories", params: { limit: 100, ...(params ?? {}) } }), providesTags: ["Categories"] }),
  getAdminCategory: builder.query<AdminCategory, string>({ query: (id) => `/categories/${id}`, providesTags: ["Categories"] }),
  getCategoryDeletionImpact: builder.query<CatalogDeletionImpact, string>({ query: (id) => `/categories/${id}/deletion-impact` }),
  createCategory: builder.mutation<AdminCategory, CategoryInput>({ query: (body) => ({ url: "/categories", method: "POST", body }), invalidatesTags: ["Services", "Categories"] }),
  updateCategory: builder.mutation<AdminCategory, { id: string; body: CategoryUpdateInput }>({ query: ({ id, body }) => ({ url: `/categories/${id}`, method: "PATCH", body }), invalidatesTags: ["Services", "Categories", "Courses"] }),
  publishCategory: builder.mutation<AdminCategory, string>({ query: (id) => ({ url: `/categories/${id}/publish`, method: "PATCH" }), invalidatesTags: ["Services", "Categories"] }),
  unpublishCategory: builder.mutation<AdminCategory, string>({ query: (id) => ({ url: `/categories/${id}/unpublish`, method: "PATCH" }), invalidatesTags: ["Services", "Categories", "Courses"] }),
  archiveCategory: builder.mutation<AdminCategory, string>({ query: (id) => ({ url: `/categories/${id}/archive`, method: "PATCH" }), invalidatesTags: ["Services", "Categories", "Courses"] }),
  unarchiveCategory: builder.mutation<AdminCategory, string>({ query: (id) => ({ url: `/categories/${id}/unarchive`, method: "PATCH" }), invalidatesTags: ["Services", "Categories", "Courses"] }),
  deleteCategoryPermanently: builder.mutation<PermanentDeleteResult, string>({ query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }), invalidatesTags: ["Services", "Categories", "Courses", "Sessions", "Enrollments", "Certificates", "Projects"] }),
  getAdminCourses: builder.query<List<AdminCourse, "courses">, { serviceType?: LearningServiceType; categoryId?: string } | void>({ query: (params) => ({ url: "/courses", params: { limit: 100, ...(params ?? {}) } }), providesTags: ["Courses"] }),
  getAdminCourse: builder.query<AdminCourse, string>({ query: (id) => `/courses/${id}`, providesTags: ["Courses"] }),
  getCourseDeletionImpact: builder.query<CatalogDeletionImpact, string>({ query: (id) => `/courses/${id}/deletion-impact` }),
  createCourse: builder.mutation<AdminCourse, CourseInput>({ query: (body) => ({ url: "/courses", method: "POST", body }), invalidatesTags: ["Services", "Courses", "Categories"] }),
  updateCourse: builder.mutation<AdminCourse, { id: string; body: CourseUpdateInput }>({ query: ({ id, body }) => ({ url: `/courses/${id}`, method: "PATCH", body }), invalidatesTags: ["Services", "Courses", "Categories"] }),
  setCourseEnrollmentStatus: builder.mutation<AdminCourse, { id: string; status: CourseEnrollmentStatus }>({ query: ({ id, status }) => ({ url: `/courses/${id}/enrollment-status`, method: "PATCH", body: { status } }), invalidatesTags: ["Services", "Courses"] }),
  publishCourse: builder.mutation<AdminCourse, string>({ query: (id) => ({ url: `/courses/${id}/publish`, method: "PATCH" }), invalidatesTags: ["Services", "Courses"] }),
  unpublishCourse: builder.mutation<AdminCourse, string>({ query: (id) => ({ url: `/courses/${id}/unpublish`, method: "PATCH" }), invalidatesTags: ["Services", "Courses"] }),
  archiveCourse: builder.mutation<AdminCourse, string>({ query: (id) => ({ url: `/courses/${id}/archive`, method: "PATCH" }), invalidatesTags: ["Services", "Courses", "Categories"] }),
  unarchiveCourse: builder.mutation<AdminCourse, string>({ query: (id) => ({ url: `/courses/${id}/unarchive`, method: "PATCH" }), invalidatesTags: ["Services", "Courses", "Categories"] }),
  deleteCoursePermanently: builder.mutation<PermanentDeleteResult, string>({ query: (id) => ({ url: `/courses/${id}`, method: "DELETE" }), invalidatesTags: ["Services", "Courses", "Categories", "Sessions", "Enrollments", "Certificates", "Projects"] }),
  selfEnrollCourse: builder.mutation<MyEnrollment, string>({ query: (courseId) => ({ url: `/courses/${courseId}/enroll`, method: "POST" }), invalidatesTags: ["Services", "Enrollments"] }),
}) });

export const {
  useGetAdminLearningServiceSummariesQuery,
  useGetAdminCategoriesQuery, useGetAdminCategoryQuery, useLazyGetCategoryDeletionImpactQuery, useCreateCategoryMutation,
  useUpdateCategoryMutation, usePublishCategoryMutation, useUnpublishCategoryMutation,
  useArchiveCategoryMutation, useUnarchiveCategoryMutation, useDeleteCategoryPermanentlyMutation,
  useGetAdminCoursesQuery, useGetAdminCourseQuery, useLazyGetCourseDeletionImpactQuery,
  useCreateCourseMutation, useUpdateCourseMutation, usePublishCourseMutation,
  useSetCourseEnrollmentStatusMutation,
  useUnpublishCourseMutation, useArchiveCourseMutation, useUnarchiveCourseMutation,
  useDeleteCoursePermanentlyMutation, useSelfEnrollCourseMutation,
} = catalogApi;
