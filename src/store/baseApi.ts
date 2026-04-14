import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";
import { toNormalizedApiError, type NormalizedApiError } from "@/lib/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithNormalizedErrors: BaseQueryFn<
  string | FetchArgs,
  unknown,
  NormalizedApiError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const error = result.error as FetchBaseQueryError & {
      error?: string;
      data?: unknown;
    };

    return {
      error: toNormalizedApiError(error.status, error.data ?? error.error),
    };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithNormalizedErrors,
  tagTypes: ["Auth", "Bootcamps", "Enrollments", "Users", "Audit"],
  endpoints: () => ({}),
});
