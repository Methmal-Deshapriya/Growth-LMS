import { baseApi } from "@/store/baseApi";
import type { UserRecord } from "./usersTypes";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserRecord[], void>({
      query: () => "/users",
      transformResponse: (response: { data: UserRecord[] }) => response.data,
      providesTags: ["Users"],
    }),
    promoteUser: builder.mutation<UserRecord, string>({
      query: (id) => ({
        url: `/users/${id}/promote`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: UserRecord }) => response.data,
      invalidatesTags: ["Users"],
    }),
    demoteUser: builder.mutation<UserRecord, string>({
      query: (id) => ({
        url: `/users/${id}/demote`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: UserRecord }) => response.data,
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  usePromoteUserMutation,
  useDemoteUserMutation,
} = usersApi;