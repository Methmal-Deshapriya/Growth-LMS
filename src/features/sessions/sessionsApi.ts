import { baseApi } from "@/store/baseApi";
import type {
  Session,
  CreateSessionRequest,
  UpdateSessionRequest,
  ReorderSessionsRequest,
  EnrollmentProgress,
} from "./sessionsTypes";

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Student & Admin: Get all sessions for a bootcamp
    getBootcampSessions: builder.query<Session[], string>({
      query: (bootcampId) => `bootcamps/${bootcampId}/sessions`,
      providesTags: (result, error, bootcampId) => [
        { type: "Sessions", id: `LIST-${bootcampId}` },
        ...(result ? result.map((s) => ({ type: "Sessions" as const, id: s.id })) : []),
      ],
    }),

    // Student & Admin: Get single session details
    getSessionDetails: builder.query<Session, string>({
      query: (id) => `sessions/${id}`,
      providesTags: (result, error, id) => [{ type: "Sessions", id }],
    }),

    // Admin: Create a new session
    createSession: builder.mutation<Session, { bootcampId: string; data: CreateSessionRequest }>({
      query: ({ bootcampId, data }) => ({
        url: `bootcamps/${bootcampId}/sessions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { bootcampId }) => [
        { type: "Sessions", id: `LIST-${bootcampId}` },
      ],
    }),

    // Admin: Update a session
    updateSession: builder.mutation<Session, { id: string; data: UpdateSessionRequest }>({
      query: ({ id, data }) => ({
        url: `sessions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Sessions", id },
        { type: "Sessions", id: "LIST" }, // Invalidate lists as title/order might change
      ],
    }),

    // Admin: Delete a session
    deleteSession: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Sessions", id },
        { type: "Sessions", id: "LIST" },
      ],
    }),

    // Admin: Reorder sessions
    reorderSessions: builder.mutation<void, { bootcampId: string; data: ReorderSessionsRequest }>({
      query: ({ bootcampId, data }) => ({
        url: `bootcamps/${bootcampId}/sessions/reorder`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { bootcampId }) => [
        { type: "Sessions", id: `LIST-${bootcampId}` },
      ],
    }),

    // Student: Mark session complete
    markSessionComplete: builder.mutation<void, string>({
      query: (id) => ({
        url: `sessions/${id}/complete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Sessions", id },
        "Enrollments", // Progress affects enrollment view
      ],
    }),

    // Student: Unmark session complete
    unmarkSessionComplete: builder.mutation<void, string>({
      query: (id) => ({
        url: `sessions/${id}/complete`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Sessions", id },
        "Enrollments",
      ],
    }),

    // Student & Admin: Get progress
    getEnrollmentProgress: builder.query<EnrollmentProgress, string>({
      query: (enrollmentId) => `enrollments/${enrollmentId}/progress`,
      providesTags: (result, error, enrollmentId) => [
        { type: "Enrollments", id: `PROGRESS-${enrollmentId}` },
      ],
    }),
  }),
});

export const {
  useGetBootcampSessionsQuery,
  useGetSessionDetailsQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useReorderSessionsMutation,
  useMarkSessionCompleteMutation,
  useUnmarkSessionCompleteMutation,
  useGetEnrollmentProgressQuery,
} = sessionsApi;
