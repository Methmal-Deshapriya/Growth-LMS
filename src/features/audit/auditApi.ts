import { baseApi } from "@/store/baseApi";
import type { ApiSuccess } from "@/lib/api";
import type { AuditLogsResponse, AuditLogsParams } from "./auditTypes";

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogsResponse, AuditLogsParams>({
      query: (params) => ({
        url: "/audit/logs",
        params,
      }),
      transformResponse: (response: ApiSuccess<AuditLogsResponse>) =>
        response.data as AuditLogsResponse,
      providesTags: ["Audit"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
