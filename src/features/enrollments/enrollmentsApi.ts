import { baseApi } from "@/store/baseApi";
import type {
  MyEnrollment,
  ClassRosterEntry,
  CreateEnrollmentRequest,
  UpdateEnrollmentRequest,
  EligibleStudent,
  EligibleStudentsParams,
} from "./enrollmentsTypes";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<MyEnrollment[], void>({
      query: () => "/enrollments/my",
      providesTags: ["Enrollments"],
    }),
    getCourseRoster: builder.query<ClassRosterEntry[], string>({
      query: (courseId) => `/enrollments/course/${courseId}`,
      providesTags: ["Enrollments"],
    }),
    getEligibleStudents: builder.query<EligibleStudent[], EligibleStudentsParams>({
      query: ({ courseId, q, limit = 5 }) => ({
        url: `/enrollments/course/${courseId}/eligible-students`,
        params: { q, limit },
      }),
      providesTags: ["Enrollments"],
    }),
    createEnrollment: builder.mutation<MyEnrollment, CreateEnrollmentRequest>({
      query: (body) => ({
        url: "/enrollments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enrollments"],
    }),
    updateEnrollment: builder.mutation<MyEnrollment, { id: string; data: UpdateEnrollmentRequest }>({
      query: ({ id, data }) => ({
        url: `/enrollments/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Enrollments", id },
        "Enrollments",
      ],
    }),
  }),
});

export const {
  useGetMyEnrollmentsQuery,
  useGetCourseRosterQuery,
  useGetEligibleStudentsQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
} = enrollmentsApi;
