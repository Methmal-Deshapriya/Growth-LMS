import { baseApi } from "@/store/baseApi";
import type {
  StudentProject,
  SubmitProjectRequest,
  UpdateProjectRequest,
  ReviewProjectRequest,
} from "./projectsTypes";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public: Get showcase projects
    getPublicShowcase: builder.query<StudentProject[], void>({
      query: () => "projects/showcase",
      providesTags: (result) => [
        { type: "Projects", id: "SHOWCASE" },
        ...(result ? result.map((p) => ({ type: "Projects" as const, id: p.id })) : []),
      ],
    }),

    // Student: Get my projects
    getMyProjects: builder.query<StudentProject[], void>({
      query: () => "projects/my",
      providesTags: (result) => [
        { type: "Projects", id: "MY" },
        ...(result ? result.map((p) => ({ type: "Projects" as const, id: p.id })) : []),
      ],
    }),

    // Admin: Get all projects
    getAllProjectsAdmin: builder.query<StudentProject[], void>({
      query: () => "projects/admin/all",
      providesTags: (result) => [
        { type: "Projects", id: "ADMIN-LIST" },
        ...(result ? result.map((p) => ({ type: "Projects" as const, id: p.id })) : []),
      ],
    }),

    // Admin, Student, Public: Get project details
    getProjectDetails: builder.query<StudentProject, string>({
      query: (id) => `projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),

    // Student: Submit project
    submitProject: builder.mutation<StudentProject, SubmitProjectRequest>({
      query: (data) => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Projects", id: "MY" }, { type: "Projects", id: "ADMIN-LIST" }],
    }),

    // Student: Update project
    updateProject: builder.mutation<StudentProject, { id: string; data: UpdateProjectRequest }>({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Projects", id },
        { type: "Projects", id: "MY" },
        { type: "Projects", id: "ADMIN-LIST" },
      ],
    }),

    // Admin: Review project
    reviewProject: builder.mutation<StudentProject, { id: string; data: ReviewProjectRequest }>({
      query: ({ id, data }) => ({
        url: `projects/${id}/review`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Projects", id },
        { type: "Projects", id: "MY" },
        { type: "Projects", id: "ADMIN-LIST" },
        { type: "Projects", id: "SHOWCASE" },
      ],
    }),
  }),
});

export const {
  useGetPublicShowcaseQuery,
  useGetMyProjectsQuery,
  useGetAllProjectsAdminQuery,
  useGetProjectDetailsQuery,
  useSubmitProjectMutation,
  useUpdateProjectMutation,
  useReviewProjectMutation,
} = projectsApi;
