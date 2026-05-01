import { baseApi } from "@/store/baseApi";
import type { UserRecord, UsersResponse, GetUsersParams } from "./usersTypes";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, GetUsersParams | void>({
      query: (params?: GetUsersParams | undefined) => ({
        url: "/users",
        params,
      }),
      providesTags: ["Users"],
    }),
    promoteUser: builder.mutation<UserRecord, string>({
      query: (id) => ({
        url: `/users/${id}/promote`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    demoteUser: builder.mutation<UserRecord, string>({
      query: (id) => ({
        url: `/users/${id}/demote`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  usePromoteUserMutation,
  useDemoteUserMutation,
} = usersApi;
