import { baseApi } from "@/store/baseApi";
import type { User, LoginRequest, RegisterRequest } from "./authTypes";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: { data: User }) => response.data,
      providesTags: ["Auth"],
    }),
    login: builder.mutation<User, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: User }) => response.data,
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<User, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: User }) => response.data,
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;