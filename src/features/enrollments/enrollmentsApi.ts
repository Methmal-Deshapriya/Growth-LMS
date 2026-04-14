import { baseApi } from "@/store/baseApi";
import type {
  MyEnrollment,
  ClassRosterEntry,
  CreateEnrollmentRequest,
} from "./enrollmentsTypes";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<MyEnrollment[], void>({
      query: () => "/enrollments/my",
      transformResponse: (response: { data: MyEnrollment[] }) => response.data,
      providesTags: ["Enrollments"],
    }),
    getBootcampRoster: builder.query<ClassRosterEntry[], string>({
      query: (bootcampId) => `/enrollments/bootcamp/${bootcampId}`,
      transformResponse: (response: { data: ClassRosterEntry[] }) =>
        response.data,
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
  useCreateEnrollmentMutation,
} = enrollmentsApi;