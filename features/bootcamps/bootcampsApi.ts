import { baseApi } from "@/store/baseApi";
import type {
  Bootcamp,
  BootcampAdmin,
  CreateBootcampRequest,
  UpdateBootcampRequest,
} from "./bootcampsTypes";

export const bootcampsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Public ---
    getBootcamps: builder.query<Bootcamp[], void>({
      query: () => "/bootcamps",
      transformResponse: (response: { data: Bootcamp[] }) => response.data,
      providesTags: ["Bootcamps"],
    }),
    getBootcampBySlug: builder.query<Bootcamp, string>({
      query: (slug) => `/bootcamps/${slug}`,
      transformResponse: (response: { data: Bootcamp }) => response.data,
      providesTags: ["Bootcamps"],
    }),
    // --- Admin ---
    getAdminBootcamps: builder.query<BootcampAdmin[], void>({
      query: () => "/bootcamps/admin",
      transformResponse: (response: { data: BootcampAdmin[] }) => response.data,
      providesTags: ["Bootcamps"],
    }),
    createBootcamp: builder.mutation<BootcampAdmin, CreateBootcampRequest>({
      query: (body) => ({
        url: "/bootcamps",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: BootcampAdmin }) => response.data,
      invalidatesTags: ["Bootcamps"],
    }),
    updateBootcamp: builder.mutation<
      BootcampAdmin,
      { id: string; body: UpdateBootcampRequest }
    >({
      query: ({ id, body }) => ({
        url: `/bootcamps/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: BootcampAdmin }) => response.data,
      invalidatesTags: ["Bootcamps"],
    }),
    deleteBootcamp: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bootcamps/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bootcamps"],
    }),
    publishBootcamp: builder.mutation<BootcampAdmin, string>({
      query: (id) => ({
        url: `/bootcamps/${id}/publish`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: BootcampAdmin }) => response.data,
      invalidatesTags: ["Bootcamps"],
    }),
    unpublishBootcamp: builder.mutation<BootcampAdmin, string>({
      query: (id) => ({
        url: `/bootcamps/${id}/unpublish`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: BootcampAdmin }) => response.data,
      invalidatesTags: ["Bootcamps"],
    }),
  }),
});

export const {
  useGetBootcampsQuery,
  useGetBootcampBySlugQuery,
  useGetAdminBootcampsQuery,
  useCreateBootcampMutation,
  useUpdateBootcampMutation,
  useDeleteBootcampMutation,
  usePublishBootcampMutation,
  useUnpublishBootcampMutation,
} = bootcampsApi;