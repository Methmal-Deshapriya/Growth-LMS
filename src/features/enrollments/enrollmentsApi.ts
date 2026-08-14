import { baseApi } from "@/store/baseApi";
import type {
  BulkEnrollmentResult,
  ClassRosterEntry,
  CreatePaidEnrollmentRequest,
  EligibleStudentsPage,
  EligibleStudentsParams,
  MyEnrollment,
  RosterPage,
  RosterParams,
  UpdateEnrollmentRequest,
} from "./enrollmentsTypes";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<MyEnrollment[], void>({
      query: () => "/enrollments/my",
      providesTags: ["Enrollments"],
    }),
    getCourseRoster: builder.query<RosterPage, { courseId: string } & RosterParams>({
      query: ({ courseId, ...params }) => ({
        url: `/enrollments/course/${courseId}`,
        params,
      }),
      providesTags: ["Enrollments"],
    }),
    getBatchRoster: builder.query<RosterPage, { batchId: string } & RosterParams>({
      query: ({ batchId, ...params }) => ({
        url: `/batches/${batchId}/enrollments`,
        params,
      }),
      providesTags: (_result, _error, { batchId }) => [
        { type: "Enrollments", id: `BATCH-${batchId}` },
      ],
    }),
    getEligibleStudents: builder.query<EligibleStudentsPage, EligibleStudentsParams>({
      query: ({ batchId, q, limit = 25, cursor }) => ({
        url: `/batches/${batchId}/eligible-students`,
        params: { q, limit, cursor },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs: { batchId, q } }) =>
        `${endpointName}:${batchId}:${q ?? ""}`,
      merge: (currentCache, incoming, { arg }) => {
        if (!arg.cursor) return incoming;
        const existingIds = new Set(currentCache.students.map(({ id }) => id));
        currentCache.students.push(
          ...incoming.students.filter(({ id }) => !existingIds.has(id)),
        );
        currentCache.pagination = incoming.pagination;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.cursor !== previousArg?.cursor,
      providesTags: (_result, _error, { batchId }) => [
        { type: "Enrollments", id: `ELIGIBLE-${batchId}` },
      ],
    }),
    createEnrollment: builder.mutation<
      ClassRosterEntry,
      { batchId: string; data: CreatePaidEnrollmentRequest }
    >({
      query: ({ batchId, data }) => ({
        url: `/batches/${batchId}/enrollments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Enrollments", id: `BATCH-${batchId}` },
        { type: "Enrollments", id: `ELIGIBLE-${batchId}` },
        "Batches",
        "Services",
      ],
    }),
    bulkCreateEnrollments: builder.mutation<
      BulkEnrollmentResult,
      { batchId: string; students: CreatePaidEnrollmentRequest[] }
    >({
      query: ({ batchId, students }) => ({
        url: `/batches/${batchId}/enrollments/bulk`,
        method: "POST",
        body: { students },
      }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Enrollments", id: `BATCH-${batchId}` },
        { type: "Enrollments", id: `ELIGIBLE-${batchId}` },
        "Batches",
        "Services",
      ],
    }),
    updateEnrollment: builder.mutation<
      ClassRosterEntry,
      { id: string; data: UpdateEnrollmentRequest }
    >({
      query: ({ id, data }) => ({ url: `/enrollments/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Enrollments", id },
        "Enrollments",
        "Services",
      ],
    }),
  }),
});

export const {
  useGetMyEnrollmentsQuery,
  useGetCourseRosterQuery,
  useGetBatchRosterQuery,
  useGetEligibleStudentsQuery,
  useCreateEnrollmentMutation,
  useBulkCreateEnrollmentsMutation,
  useUpdateEnrollmentMutation,
} = enrollmentsApi;
