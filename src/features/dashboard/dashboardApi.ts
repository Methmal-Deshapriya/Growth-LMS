import { baseApi } from "@/store/baseApi";
import type { AdminDashboardSummary, StudentDashboardSummary } from "./dashboardTypes";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentDashboard: builder.query<StudentDashboardSummary, void>({
      query: () => "/dashboard/student",
      providesTags: ["Enrollments", "Certificates"],
    }),
    getAdminDashboard: builder.query<AdminDashboardSummary, void>({
      query: () => "/dashboard/admin",
      providesTags: ["Enrollments", "EnrollmentRequests", "Certificates", "Users"],
    }),
  }),
});

export const { useGetStudentDashboardQuery, useGetAdminDashboardQuery } = dashboardApi;
