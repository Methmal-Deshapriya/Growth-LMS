import { baseApi } from "@/store/baseApi";
import type {
  Batch,
  BatchInput,
  BatchSessionsResponse,
  BatchStatus,
} from "./batchesTypes";

interface BatchList {
  batches: Batch[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}

export const batchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseBatches: builder.query<BatchList, string>({
      query: (courseId) => `/courses/${courseId}/batches?limit=100`,
      providesTags: (_result, _error, courseId) => [{ type: "Batches", id: courseId }],
    }),
    getBatch: builder.query<Batch, string>({
      query: (batchId) => `/batches/${batchId}`,
      providesTags: (_result, _error, batchId) => [{ type: "Batches", id: batchId }],
    }),
    createBatch: builder.mutation<
      { batch: Batch; curriculumMode: "LIVE_INHERITED" },
      { courseId: string; data: BatchInput }
    >({
      query: ({ courseId, data }) => ({
        url: `/courses/${courseId}/batches`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Batches", id: courseId },
        "Courses",
        "Services",
      ],
    }),
    updateBatch: builder.mutation<Batch, { batchId: string; data: Partial<BatchInput> }>({
      query: ({ batchId, data }) => ({ url: `/batches/${batchId}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Batches", id: batchId },
        "Services",
      ],
    }),
    updateBatchStatus: builder.mutation<Batch, { batchId: string; status: BatchStatus }>({
      query: ({ batchId, status }) => ({
        url: `/batches/${batchId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Batches", id: batchId },
        "Batches",
        "Services",
      ],
    }),
    getBatchSessions: builder.query<BatchSessionsResponse, string>({
      query: (batchId) => `/batches/${batchId}/sessions`,
      providesTags: (_result, _error, batchId) => [
        { type: "Batches", id: `SESSIONS-${batchId}` },
      ],
    }),
    updateBatchSessionDelivery: builder.mutation<
      unknown,
      {
        batchId: string;
        courseSessionId: string;
        mode: "UNRELEASED" | "RELEASED" | "SCHEDULED";
        availableAt?: string | null;
        acknowledgeSequenceRisk?: boolean;
      }
    >({
      query: ({ batchId, courseSessionId, ...body }) => ({
        url: `/batches/${batchId}/sessions/${courseSessionId}/delivery`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Batches", id: `SESSIONS-${batchId}` },
        { type: "Batches", id: batchId },
      ],
    }),
  }),
});

export const {
  useGetCourseBatchesQuery,
  useGetBatchQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useUpdateBatchStatusMutation,
  useGetBatchSessionsQuery,
  useUpdateBatchSessionDeliveryMutation,
} = batchesApi;
