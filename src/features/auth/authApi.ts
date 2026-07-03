import { baseApi } from "@/store/baseApi";
import type { ApiSuccess } from "@/lib/api";
import type { User, LoginRequest, RegisterRequest, UpdateProfileRequest } from "./authTypes";
import { setUser, clearUser } from "./authSlice";
import type { AppDispatch } from "@/store/store";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: "/users/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<User, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (err) {
          // Error is handled by normalized error middleware and components
        }
      },
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<User, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (err) {
          // Error is handled by normalized error middleware and components
        }
      },
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearUser());
          dispatch(baseApi.util.resetApiState());
        } catch (err) {
          // Logout failure is rare but we clear user anyway for safety
          dispatch(clearUser());
          dispatch(baseApi.util.resetApiState());
        }
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
