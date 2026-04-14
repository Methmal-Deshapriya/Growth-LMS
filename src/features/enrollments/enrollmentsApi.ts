import { baseApi } from "@/store/baseApi";
import type { ApiSuccess } from "@/lib/api";
import type {
  MyEnrollment,
  ClassRosterEntry,
  CreateEnrollmentRequest,
} from "./enrollmentsTypes";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<MyEnrollment[], void>({
      query: () => "/enrollments/my",
      transformResponse: (response: ApiSuccess<MyEnrollment[]>) =>
        response.data as MyEnrollment[],
      providesTags: ["Enrollments"],
    }),
    getBootcampRoster: builder.query<ClassRosterEntry[], string>({
      query: (bootcampId) => `/enrollments/bootcamp/${bootcampId}`,
      transformResponse: (response: ApiSuccess<ClassRosterEntry[]>) =>
        response.data as ClassRosterEntry[],
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
