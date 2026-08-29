import { baseApi } from "@/store/baseApi";
import type {
  BulkEnrollmentResult,
  ClassRosterEntry,
  CreatePaidEnrollmentRequest,
  EligibleStudentsPage,
  EligibleStudentsParams,
  MyEnrollmentsPage,
  RosterPage,
  RosterParams,
  UpdateEnrollmentRequest,
  SelfHistoryParams,
} from "./enrollmentsTypes";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<MyEnrollmentsPage, SelfHistoryParams | void>({
      query: (params) => ({ url: "/enrollments/my", params: params ?? {} }),
      providesTags: ["Enrollments"],
    }),
    getCourseRoster: builder.query<RosterPage, { courseId: string } & RosterParams>({
      query: ({ courseId, ...params }) => ({
        url: `/courses/${courseId}/enrollments`,
        params,
      }),
      providesTags: (_result, _error, { courseId }) => [
        { type: "Enrollments", id: `COURSE-${courseId}` },
      ],
    }),
    getEligibleStudents: builder.query<EligibleStudentsPage, EligibleStudentsParams>({
      query: ({ courseId, q, limit = 25, cursor }) => ({
        url: `/courses/${courseId}/eligible-students`,
        params: { q, limit, cursor },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs: { courseId, q } }) =>
        `${endpointName}:${courseId}:${q ?? ""}`,
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
      providesTags: (_result, _error, { courseId }) => [
        { type: "Enrollments", id: `ELIGIBLE-${courseId}` },
      ],
    }),
    createEnrollment: builder.mutation<
      ClassRosterEntry,
      { courseId: string; data: CreatePaidEnrollmentRequest }
    >({
      query: ({ courseId, data }) => ({
        url: `/courses/${courseId}/enrollments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Enrollments", id: `COURSE-${courseId}` },
        { type: "Enrollments", id: `ELIGIBLE-${courseId}` },
        "Courses",
        "Services",
      ],
    }),
    bulkCreateEnrollments: builder.mutation<
      BulkEnrollmentResult,
      { courseId: string; students: CreatePaidEnrollmentRequest[] }
    >({
      query: ({ courseId, students }) => ({
        url: `/courses/${courseId}/enrollments/bulk`,
        method: "POST",
        body: { students },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Enrollments", id: `COURSE-${courseId}` },
        { type: "Enrollments", id: `ELIGIBLE-${courseId}` },
        "Courses",
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
  useGetEligibleStudentsQuery,
  useCreateEnrollmentMutation,
  useBulkCreateEnrollmentsMutation,
  useUpdateEnrollmentMutation,
} = enrollmentsApi;
