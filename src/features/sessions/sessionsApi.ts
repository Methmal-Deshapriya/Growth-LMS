import { baseApi } from "@/store/baseApi";
import type {
  BulkArchiveSessionsResult,
  CourseSessionDeliveryStatus,
  CourseSession,
  CreateSessionRequest,
  ClassroomResponse,
  ClassroomSession,
  CurriculumResponse,
  EnrollmentProgress,
  LibrarySession,
  SessionCompletionResult,
  SessionStatus,
  UpdateSessionRequest,
} from "./sessionsTypes";

interface SessionListResponse {
  sessions: LibrarySession[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessionLibrary: builder.query<
      SessionListResponse,
      {
        q?: string;
        status?: SessionStatus;
        tag?: string;
        attachableCourseId?: string;
        limit?: number;
        offset?: number;
      } | void
    >({
      query: (params) => ({
        url: "/sessions",
        params: { limit: 20, ...(params || {}) },
      }),
      providesTags: (result) => [
        { type: "Sessions", id: "LIBRARY" },
        ...(result?.sessions.map(({ id }) => ({ type: "Sessions" as const, id })) ?? []),
      ],
    }),
    getSessionDetails: builder.query<LibrarySession, string>({
      query: (id) => `/sessions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sessions", id }],
    }),
    createSession: builder.mutation<LibrarySession, CreateSessionRequest>({
      query: (body) => ({ url: "/sessions", method: "POST", body }),
      invalidatesTags: [{ type: "Sessions", id: "LIBRARY" }],
    }),
    updateSession: builder.mutation<LibrarySession, { id: string; data: UpdateSessionRequest }>({
      query: ({ id, data }) => ({ url: `/sessions/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Sessions", id },
        { type: "Sessions", id: "LIBRARY" },
        "Curriculum",
      ],
    }),
    archiveSession: builder.mutation<LibrarySession, string>({
      query: (id) => ({ url: `/sessions/${id}/archive`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Sessions", id },
        { type: "Sessions", id: "LIBRARY" },
      ],
    }),
    unarchiveSession: builder.mutation<LibrarySession, string>({
      query: (id) => ({ url: `/sessions/${id}/unarchive`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Sessions", id },
        { type: "Sessions", id: "LIBRARY" },
      ],
    }),
    deleteSession: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/sessions/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Sessions", id: "LIBRARY" }],
    }),
    duplicateSession: builder.mutation<LibrarySession, string>({
      query: (id) => ({ url: `/sessions/${id}/duplicate`, method: "POST" }),
      invalidatesTags: [{ type: "Sessions", id: "LIBRARY" }],
    }),
    bulkArchiveSessions: builder.mutation<BulkArchiveSessionsResult, string[]>({
      query: (ids) => ({ url: "/sessions/bulk-archive", method: "POST", body: { ids } }),
      invalidatesTags: [{ type: "Sessions", id: "LIBRARY" }],
    }),
    getCourseCurriculum: builder.query<CurriculumResponse, { courseId: string; includeRetired?: boolean }>({
      query: ({ courseId, includeRetired }) => ({
        url: `/courses/${courseId}/curriculum`,
        params: { includeRetired: Boolean(includeRetired) },
      }),
      providesTags: (_result, _error, { courseId }) => [
        { type: "Curriculum", id: courseId },
      ],
    }),
    attachCourseSession: builder.mutation<
      { courseSession: CourseSession },
      { courseId: string; sessionId: string; orderIndex?: number }
    >({
      query: ({ courseId, ...body }) => ({
        url: `/courses/${courseId}/curriculum`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Curriculum", id: courseId },
        { type: "Sessions", id: "LIBRARY" },
        "Courses",
        "Services",
      ],
    }),
    reorderCourseCurriculum: builder.mutation<
      { success: true },
      {
        courseId: string;
        courseSessions: { id: string; orderIndex: number }[];
        acknowledgeSequenceRisk?: boolean;
      }
    >({
      query: ({ courseId, courseSessions, acknowledgeSequenceRisk }) => ({
        url: `/courses/${courseId}/curriculum/reorder`,
        method: "PATCH",
        body: { courseSessions, acknowledgeSequenceRisk },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Curriculum", id: courseId },
        "Courses",
      ],
    }),
    removeCourseSession: builder.mutation<
      { id: string; action: "DETACHED" | "RETIRED" },
      { courseId: string; courseSessionId: string }
    >({
      query: ({ courseId, courseSessionId }) => ({
        url: `/courses/${courseId}/curriculum/${courseSessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Curriculum", id: courseId },
        { type: "Sessions", id: "LIBRARY" },
        "Courses",
        "Services",
      ],
    }),
    updateCourseSessionDelivery: builder.mutation<
      CourseSession,
      {
        courseId: string;
        courseSessionId: string;
        status: CourseSessionDeliveryStatus;
        availableAt?: string | null;
        acknowledgeSequenceRisk?: boolean;
      }
    >({
      query: ({ courseId, courseSessionId, ...body }) => ({
        url: `/courses/${courseId}/curriculum/${courseSessionId}/delivery`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Curriculum", id: courseId },
        "Courses",
      ],
    }),
    getEnrollmentProgress: builder.query<EnrollmentProgress, string>({
      query: (enrollmentId) => `/enrollments/${enrollmentId}/progress`,
      providesTags: (_result, _error, enrollmentId) => [
        { type: "Enrollments", id: `PROGRESS-${enrollmentId}` },
      ],
    }),
    getClassroom: builder.query<ClassroomResponse, string>({
      query: (enrollmentId) => `/enrollments/${enrollmentId}/classroom`,
      providesTags: (_result, _error, enrollmentId) => [
        { type: "Enrollments", id: `CLASSROOM-${enrollmentId}` },
      ],
    }),
    getClassroomSession: builder.query<
      ClassroomSession,
      { enrollmentId: string; courseSessionId: string }
    >({
      query: ({ enrollmentId, courseSessionId }) =>
        `/enrollments/${enrollmentId}/sessions/${courseSessionId}`,
      providesTags: (_result, _error, { enrollmentId, courseSessionId }) => [
        { type: "Enrollments", id: `CLASSROOM-${enrollmentId}` },
        { type: "Sessions", id: courseSessionId },
      ],
    }),
    completeClassroomSession: builder.mutation<
      SessionCompletionResult,
      { enrollmentId: string; courseSessionId: string }
    >({
      query: ({ enrollmentId, courseSessionId }) => ({
        url: `/enrollments/${enrollmentId}/sessions/${courseSessionId}/complete`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { enrollmentId }) => [
        { type: "Enrollments", id: `CLASSROOM-${enrollmentId}` },
        { type: "Enrollments", id: `PROGRESS-${enrollmentId}` },
      ],
    }),
    uncompleteClassroomSession: builder.mutation<
      { success: true; removed: boolean },
      { enrollmentId: string; courseSessionId: string }
    >({
      query: ({ enrollmentId, courseSessionId }) => ({
        url: `/enrollments/${enrollmentId}/sessions/${courseSessionId}/complete`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { enrollmentId }) => [
        { type: "Enrollments", id: `CLASSROOM-${enrollmentId}` },
        { type: "Enrollments", id: `PROGRESS-${enrollmentId}` },
      ],
    }),
  }),
});

export const {
  useGetSessionLibraryQuery,
  useGetSessionDetailsQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useArchiveSessionMutation,
  useUnarchiveSessionMutation,
  useDeleteSessionMutation,
  useDuplicateSessionMutation,
  useBulkArchiveSessionsMutation,
  useGetCourseCurriculumQuery,
  useAttachCourseSessionMutation,
  useReorderCourseCurriculumMutation,
  useRemoveCourseSessionMutation,
  useUpdateCourseSessionDeliveryMutation,
  useGetEnrollmentProgressQuery,
  useGetClassroomQuery,
  useGetClassroomSessionQuery,
  useCompleteClassroomSessionMutation,
  useUncompleteClassroomSessionMutation,
} = sessionsApi;
