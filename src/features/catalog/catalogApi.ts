import { baseApi } from "@/store/baseApi";
import type {
  LearningServiceType,
  CourseLevel,
  PublicLearningService,
} from "./catalogTypes";
import type { MyEnrollment } from "@/features/enrollments/enrollmentsTypes";

export type CatalogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type CourseStatus =
  | "DRAFT"
  | "OPEN_ACTIVE"
  | "CLOSED_ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";
export type CourseInstanceKind = "SEASONAL" | "EVERGREEN";
export type LearningServiceStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface LearningService {
  id: string;
  key: LearningServiceType;
  slug: string;
  title: string;
  description: string;
  accessType: "FREE" | "PAID";
  courseMode: CourseInstanceKind;
  enrollmentMode: "ADMIN" | "SELF";
  paymentRequirement: "REQUIRED" | "NOT_REQUIRED";
  status: LearningServiceStatus;
  sortOrder: number;
  categoryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  serviceId: string;
  service: LearningService;
  slug: string;
  title: string;
  description: string;
  audienceLabel: string | null;
  visualKey: string;
  badgeLabel: string | null;
  status: CatalogStatus;
  sortOrder: number;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourseGroup {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  batchCodePrefix: string;
  certificateEnabled: boolean;
  archivedAt: string | null;
  category: AdminCategory;
  courses: AdminCourse[];
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourse {
  id: string;
  courseGroupId: string;
  categoryId: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  level: CourseLevel;
  durationValue: number | null;
  durationUnit: "SESSION" | "DAY" | "WEEK" | "MONTH" | null;
  accessType: "FREE" | "PAID";
  price: number;
  currency: "LKR";
  certificateEnabled: boolean;
  highlights: string[];
  skills: string[];
  prerequisites: string[];
  thumbnailUrl: string | null;
  sortOrder: number;
  intakeKey: string;
  code: string;
  instanceKind: CourseInstanceKind;
  startDate: string | null;
  expectedEndDate: string | null;
  timezone: string;
  capacity: number | null;
  status: CourseStatus;
  sessionCount: number;
  enrollmentCount: number;
  projectCount: number;
  category: AdminCategory;
  courseGroup: Omit<AdminCourseGroup, "courses" | "category">;
  createdAt: string;
  updatedAt: string;
}

export type CategoryInput = Pick<
  AdminCategory,
  "serviceId" | "slug" | "title" | "description" | "visualKey"
> &
  Partial<Pick<AdminCategory, "audienceLabel" | "badgeLabel" | "sortOrder">>;
export type CategoryUpdateInput = Partial<Omit<CategoryInput, "serviceId">>;

export interface CourseGroupInput {
  categoryId: string;
  title: string;
  slug: string;
  batchCodePrefix: string;
  certificateEnabled: boolean;
}

export interface CourseInput {
  courseGroupId: string;
  sourceCourseId?: string;
  intakeKey: string;
  startDate?: string | null;
  expectedEndDate?: string | null;
  timezone?: string;
  capacity?: number | null;
  summary?: string;
  description?: string;
  level?: CourseLevel;
  durationValue?: number | null;
  durationUnit?: AdminCourse["durationUnit"];
  price?: number;
  highlights?: string[];
  skills?: string[];
  prerequisites?: string[];
  thumbnailUrl?: string | null;
  sortOrder?: number;
}

export type CourseUpdateInput = Partial<
  Pick<AdminCourse, "startDate" | "expectedEndDate" | "timezone" | "capacity">
>;

type List<T, K extends string> = Record<K, T[]> & {
  pagination: { total: number; limit: number; offset: number };
};

export interface PermanentDeleteResult {
  id: string;
  deletedCourses?: number;
  deletedCourseGroups?: number;
}

export interface CatalogDeletionImpact {
  resourceType: "CATEGORY" | "COURSE_GROUP" | "COURSE";
  resourceId: string;
  resourceStatus: CatalogStatus | CourseStatus | "ACTIVE";
  deletable: boolean;
  courses?: number;
  courseGroups?: number;
  history?: number;
  curriculumLinks?: number;
  enrollments?: number;
  projects?: number;
}

export interface AdminLearningServiceSummary {
  id: string;
  key: LearningServiceType;
  slug: string;
  title: string;
  accessType: "FREE" | "PAID";
  courseMode: CourseInstanceKind;
  paymentRequirement: "REQUIRED" | "NOT_REQUIRED";
  status: LearningServiceStatus;
  sortOrder: number;
  categoryCount: number;
  createdAt: string;
  updatedAt: string;
  serviceType: LearningServiceType;
  serviceSlug: string;
  label: string;
  description: string;
  instanceKind: CourseInstanceKind;
  enrollmentMode: "ADMIN" | "SELF";
  categories: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  courses: {
    total: number;
    openActive: number;
    closedActive: number;
    completed: number;
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
  payments: { needsAttention: number } | null;
  attentionCount: number;
}

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicLearningServices: builder.query<
      { services: PublicLearningService[] },
      void
    >({
      query: () => "/catalog/services",
      providesTags: ["Services"],
    }),
    getAdminLearningServiceSummaries: builder.query<
      {
        services: AdminLearningServiceSummary[];
        pagination: { total: number; limit: number; offset: number };
      },
      void
    >({ query: () => "/services?limit=100", providesTags: ["Services"] }),
    getLearningService: builder.query<LearningService, string>({
      query: (id) => `/services/${id}`,
      providesTags: ["Services"],
    }),
    createLearningService: builder.mutation<
      LearningService,
      Omit<
        LearningService,
        "id" | "status" | "categoryCount" | "createdAt" | "updatedAt"
      >
    >({
      query: (body) => ({ url: "/services", method: "POST", body }),
      invalidatesTags: ["Services"],
    }),
    updateLearningService: builder.mutation<
      LearningService,
      {
        id: string;
        body: Partial<
          Pick<
            LearningService,
            | "title"
            | "description"
            | "sortOrder"
            | "slug"
            | "accessType"
            | "courseMode"
            | "enrollmentMode"
            | "paymentRequirement"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Services", "Categories", "Courses"],
    }),
    transitionLearningService: builder.mutation<
      LearningService,
      {
        id: string;
        action: "activate" | "deactivate" | "archive" | "unarchive";
        expectedStatus: LearningServiceStatus;
      }
    >({
      query: ({ id, action, expectedStatus }) => ({
        url: `/services/${id}/${action}`,
        method: "PATCH",
        body: { expectedStatus },
      }),
      invalidatesTags: ["Services", "Categories", "Courses"],
    }),
    deleteLearningService: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
      invalidatesTags: ["Services"],
    }),
    getAdminCategories: builder.query<
      List<AdminCategory, "categories">,
      { serviceId?: string } | void
    >({
      query: (params) => ({
        url: "/categories",
        params: { limit: 100, ...(params ?? {}) },
      }),
      providesTags: ["Categories"],
    }),
    getAdminCategory: builder.query<AdminCategory, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ["Categories"],
    }),
    getCategoryDeletionImpact: builder.query<CatalogDeletionImpact, string>({
      query: (id) => `/categories/${id}/deletion-impact`,
    }),
    createCategory: builder.mutation<AdminCategory, CategoryInput>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Services", "Categories"],
    }),
    updateCategory: builder.mutation<
      AdminCategory,
      { id: string; body: CategoryUpdateInput }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Services", "Categories", "Courses"],
    }),
    publishCategory: builder.mutation<AdminCategory, string>({
      query: (id) => ({ url: `/categories/${id}/publish`, method: "PATCH" }),
      invalidatesTags: ["Services", "Categories"],
    }),
    unpublishCategory: builder.mutation<AdminCategory, string>({
      query: (id) => ({ url: `/categories/${id}/unpublish`, method: "PATCH" }),
      invalidatesTags: ["Services", "Categories", "Courses"],
    }),
    archiveCategory: builder.mutation<AdminCategory, string>({
      query: (id) => ({ url: `/categories/${id}/archive`, method: "PATCH" }),
      invalidatesTags: ["Services", "Categories", "Courses"],
    }),
    unarchiveCategory: builder.mutation<AdminCategory, string>({
      query: (id) => ({ url: `/categories/${id}/unarchive`, method: "PATCH" }),
      invalidatesTags: ["Services", "Categories", "Courses"],
    }),
    deleteCategoryPermanently: builder.mutation<PermanentDeleteResult, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [
        "Services",
        "Categories",
        "Courses",
        "Sessions",
        "Enrollments",
        "Certificates",
        "Projects",
      ],
    }),

    getCourseGroups: builder.query<
      List<AdminCourseGroup, "courseGroups">,
      {
        categoryId?: string;
        serviceId?: string;
        includeArchived?: boolean;
      } | void
    >({
      query: (params) => ({
        url: "/course-groups",
        params: { limit: 100, ...(params ?? {}) },
      }),
      providesTags: ["CourseGroups"],
    }),
    getCourseGroup: builder.query<AdminCourseGroup, string>({
      query: (id) => `/course-groups/${id}`,
      providesTags: ["CourseGroups"],
    }),
    getCourseGroupDeletionImpact: builder.query<CatalogDeletionImpact, string>({
      query: (id) => `/course-groups/${id}/deletion-impact`,
    }),
    createCourseGroup: builder.mutation<AdminCourseGroup, CourseGroupInput>({
      query: (body) => ({ url: "/course-groups", method: "POST", body }),
      invalidatesTags: ["CourseGroups", "Categories", "Services"],
    }),
    updateCourseGroup: builder.mutation<
      AdminCourseGroup,
      { id: string; body: Partial<Omit<CourseGroupInput, "categoryId">> }
    >({
      query: ({ id, body }) => ({
        url: `/course-groups/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CourseGroups", "Courses"],
    }),
    archiveCourseGroup: builder.mutation<AdminCourseGroup, string>({
      query: (id) => ({ url: `/course-groups/${id}/archive`, method: "PATCH" }),
      invalidatesTags: ["CourseGroups", "Courses", "Services"],
    }),
    unarchiveCourseGroup: builder.mutation<AdminCourseGroup, string>({
      query: (id) => ({
        url: `/course-groups/${id}/unarchive`,
        method: "PATCH",
      }),
      invalidatesTags: ["CourseGroups", "Courses", "Services"],
    }),
    deleteCourseGroup: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/course-groups/${id}`, method: "DELETE" }),
      invalidatesTags: ["CourseGroups", "Categories", "Services"],
    }),

    getAdminCourses: builder.query<
      List<AdminCourse, "courses">,
      {
        serviceId?: string;
        categoryId?: string;
        courseGroupId?: string;
        status?: CourseStatus;
      } | void
    >({
      query: (params) => ({
        url: "/courses",
        params: { limit: 100, ...(params ?? {}) },
      }),
      providesTags: ["Courses"],
    }),
    getAdminCourse: builder.query<AdminCourse, string>({
      query: (id) => `/courses/${id}`,
      providesTags: ["Courses"],
    }),
    getCourseDeletionImpact: builder.query<CatalogDeletionImpact, string>({
      query: (id) => `/courses/${id}/deletion-impact`,
    }),
    createCourse: builder.mutation<AdminCourse, CourseInput>({
      query: (body) => ({ url: "/courses", method: "POST", body }),
      invalidatesTags: [
        "Services",
        "CourseGroups",
        "Courses",
        "Categories",
        "Curriculum",
      ],
    }),
    updateCourse: builder.mutation<
      AdminCourse,
      { id: string; body: CourseUpdateInput }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Services", "CourseGroups", "Courses"],
    }),
    updateCourseStatus: builder.mutation<
      AdminCourse,
      { id: string; status: CourseStatus; expectedStatus: CourseStatus }
    >({
      query: ({ id, status, expectedStatus }) => ({
        url: `/courses/${id}/status`,
        method: "PATCH",
        body: { status, expectedStatus },
      }),
      invalidatesTags: [
        "Services",
        "CourseGroups",
        "Courses",
        "Curriculum",
        "Enrollments",
      ],
    }),
    deleteCoursePermanently: builder.mutation<PermanentDeleteResult, string>({
      query: (id) => ({ url: `/courses/${id}`, method: "DELETE" }),
      invalidatesTags: [
        "Services",
        "CourseGroups",
        "Courses",
        "Categories",
        "Sessions",
        "Enrollments",
        "Certificates",
        "Projects",
      ],
    }),
    selfEnrollCourse: builder.mutation<MyEnrollment, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: ["Services", "Enrollments"],
    }),
  }),
});

export const {
  useGetPublicLearningServicesQuery,
  useGetAdminLearningServiceSummariesQuery,
  useGetLearningServiceQuery,
  useCreateLearningServiceMutation,
  useUpdateLearningServiceMutation,
  useTransitionLearningServiceMutation,
  useDeleteLearningServiceMutation,
  useGetAdminCategoriesQuery,
  useGetAdminCategoryQuery,
  useLazyGetCategoryDeletionImpactQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  usePublishCategoryMutation,
  useUnpublishCategoryMutation,
  useArchiveCategoryMutation,
  useUnarchiveCategoryMutation,
  useDeleteCategoryPermanentlyMutation,
  useGetCourseGroupsQuery,
  useGetCourseGroupQuery,
  useLazyGetCourseGroupDeletionImpactQuery,
  useCreateCourseGroupMutation,
  useUpdateCourseGroupMutation,
  useArchiveCourseGroupMutation,
  useUnarchiveCourseGroupMutation,
  useDeleteCourseGroupMutation,
  useGetAdminCoursesQuery,
  useGetAdminCourseQuery,
  useLazyGetCourseDeletionImpactQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useUpdateCourseStatusMutation,
  useDeleteCoursePermanentlyMutation,
  useSelfEnrollCourseMutation,
} = catalogApi;
