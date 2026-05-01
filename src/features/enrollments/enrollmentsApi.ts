import { baseApi } from "@/store/baseApi";
import type {
  MyEnrollment,
  ClassRosterEntry,
  CreateEnrollmentRequest,
  EligibleStudent,
  EligibleStudentsParams,
} from "./enrollmentsTypes";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<MyEnrollment[], void>({
      query: () => "/enrollments/my",
      providesTags: ["Enrollments"],
    }),
    getBootcampRoster: builder.query<ClassRosterEntry[], string>({
      query: (bootcampId) => `/enrollments/bootcamp/${bootcampId}`,
      providesTags: ["Enrollments"],
    }),
    getEligibleStudents: builder.query<EligibleStudent[], EligibleStudentsParams>({
      query: ({ bootcampId, q, limit = 5 }) => ({
        url: `/enrollments/bootcamp/${bootcampId}/eligible-students`,
        params: { q, limit },
      }),
      providesTags: ["Enrollments"],
    }),
    createEnrollment: builder.mutation<void, CreateEnrollmentRequest>({
      query: (body) => ({
        url: "/enrollments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enrollments"],
    }),
  }),
});

export const {
  useGetMyEnrollmentsQuery,
  useGetBootcampRosterQuery,
  useGetEligibleStudentsQuery,
  useCreateEnrollmentMutation,
} = enrollmentsApi;
