import { baseApi } from "@/store/baseApi";
import type { LearningServiceType, CourseLevel } from "./catalogTypes";

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
  certificateEnabled: boolean; highlights: string[]; skills: string[];
  prerequisites: string[]; thumbnailUrl: string | null; status: CatalogStatus;
  sortOrder: number; sessionCount: number; enrollmentCount: number;
  category: AdminCategory; createdAt: string; updatedAt: string;
}
export type CategoryInput = Pick<AdminCategory, "serviceType" | "slug" | "title" | "description" | "visualKey"> & Partial<Pick<AdminCategory, "audienceLabel" | "badgeLabel" | "sortOrder">>;
export type CourseInput = Pick<AdminCourse, "categoryId" | "slug" | "title" | "summary" | "description" | "level" | "accessType" | "price" | "currency"> & Partial<Pick<AdminCourse, "durationValue" | "durationUnit" | "certificateEnabled" | "highlights" | "skills" | "prerequisites" | "thumbnailUrl" | "sortOrder">>;
type List<T, K extends string> = Record<K, T[]> & { pagination: { total: number; limit: number; offset: number } };

export const catalogApi = baseApi.injectEndpoints({ endpoints: (builder) => ({
  getAdminCategories: builder.query<List<AdminCategory, "categories">, void>({ query: () => "/categories?limit=100", providesTags: ["Categories"] }),
  getAdminCategory: builder.query<AdminCategory, string>({ query: (id) => `/categories/${id}`, providesTags: ["Categories"] }),
  createCategory: builder.mutation<AdminCategory, CategoryInput>({ query: (body) => ({ url: "/categories", method: "POST", body }), invalidatesTags: ["Categories"] }),
  updateCategory: builder.mutation<AdminCategory, { id: string; body: Partial<CategoryInput> }>({ query: ({ id, body }) => ({ url: `/categories/${id}`, method: "PATCH", body }), invalidatesTags: ["Categories", "Courses"] }),
  publishCategory: builder.mutation<AdminCategory, string>({ query: (id) => ({ url: `/categories/${id}/publish`, method: "PATCH" }), invalidatesTags: ["Categories"] }),
  unpublishCategory: builder.mutation<AdminCategory, string>({ query: (id) => ({ url: `/categories/${id}/unpublish`, method: "PATCH" }), invalidatesTags: ["Categories", "Courses"] }),
  archiveCategory: builder.mutation<AdminCategory, string>({ query: (id) => ({ url: `/categories/${id}/archive`, method: "PATCH" }), invalidatesTags: ["Categories", "Courses"] }),
  getAdminCourses: builder.query<List<AdminCourse, "courses">, void>({ query: () => "/courses?limit=100", providesTags: ["Courses"] }),
  getAdminCourse: builder.query<AdminCourse, string>({ query: (id) => `/courses/${id}`, providesTags: ["Courses"] }),
  createCourse: builder.mutation<AdminCourse, CourseInput>({ query: (body) => ({ url: "/courses", method: "POST", body }), invalidatesTags: ["Courses", "Categories"] }),
  updateCourse: builder.mutation<AdminCourse, { id: string; body: Partial<CourseInput> }>({ query: ({ id, body }) => ({ url: `/courses/${id}`, method: "PATCH", body }), invalidatesTags: ["Courses", "Categories"] }),
  publishCourse: builder.mutation<AdminCourse, string>({ query: (id) => ({ url: `/courses/${id}/publish`, method: "PATCH" }), invalidatesTags: ["Courses"] }),
  unpublishCourse: builder.mutation<AdminCourse, string>({ query: (id) => ({ url: `/courses/${id}/unpublish`, method: "PATCH" }), invalidatesTags: ["Courses"] }),
  archiveCourse: builder.mutation<AdminCourse, string>({ query: (id) => ({ url: `/courses/${id}/archive`, method: "PATCH" }), invalidatesTags: ["Courses", "Categories"] }),
  selfEnrollCourse: builder.mutation<unknown, string>({ query: (courseId) => ({ url: `/courses/${courseId}/enroll`, method: "POST" }), invalidatesTags: ["Enrollments"] }),
}) });

export const {
  useGetAdminCategoriesQuery, useGetAdminCategoryQuery, useCreateCategoryMutation,
  useUpdateCategoryMutation, usePublishCategoryMutation, useUnpublishCategoryMutation,
  useArchiveCategoryMutation, useGetAdminCoursesQuery, useGetAdminCourseQuery,
  useCreateCourseMutation, useUpdateCourseMutation, usePublishCourseMutation,
  useUnpublishCourseMutation, useArchiveCourseMutation, useSelfEnrollCourseMutation,
} = catalogApi;
