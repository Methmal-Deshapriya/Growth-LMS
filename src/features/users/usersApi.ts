import { baseApi } from "@/store/baseApi";
import type { ApiSuccess } from "@/lib/api";
import type { UserRecord } from "./usersTypes";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserRecord[], void>({
      query: () => "/users",
      transformResponse: (response: ApiSuccess<UserRecord[]>) =>
        response.data as UserRecord[],
      providesTags: ["Users"],
    }),
    promoteUser: builder.mutation<UserRecord, string>({
      query: (id) => ({
        url: `/users/${id}/promote`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiSuccess<UserRecord>) =>
        response.data as UserRecord,
      invalidatesTags: ["Users"],
    }),
    demoteUser: builder.mutation<UserRecord, string>({
      query: (id) => ({
        url: `/users/${id}/demote`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiSuccess<UserRecord>) =>
        response.data as UserRecord,
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  usePromoteUserMutation,
  useDemoteUserMutation,
} = usersApi;
