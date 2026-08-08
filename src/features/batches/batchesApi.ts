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
      { batch: Batch; initializedSessionCount: number },
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
    initializeBatchCurriculum: builder.mutation<
      { batchId: string; initializedSessionCount: number },
      string
    >({
      query: (batchId) => ({ url: `/batches/${batchId}/initialize-curriculum`, method: "POST" }),
      invalidatesTags: (_result, _error, batchId) => [
        { type: "Batches", id: batchId },
        { type: "Batches", id: `SESSIONS-${batchId}` },
      ],
    }),
    getBatchSessions: builder.query<BatchSessionsResponse, string>({
      query: (batchId) => `/batches/${batchId}/sessions`,
      providesTags: (_result, _error, batchId) => [
        { type: "Batches", id: `SESSIONS-${batchId}` },
      ],
    }),
    upsertBatchSession: builder.mutation<
      unknown,
      { batchId: string; courseSessionId: string; orderIndex?: number; isReleased: boolean; availableAt?: string | null }
    >({
      query: ({ batchId, courseSessionId, ...body }) => ({
        url: `/batches/${batchId}/sessions/${courseSessionId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Batches", id: `SESSIONS-${batchId}` },
      ],
    }),
    removeBatchSession: builder.mutation<unknown, { batchId: string; courseSessionId: string }>({
      query: ({ batchId, courseSessionId }) => ({
        url: `/batches/${batchId}/sessions/${courseSessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { batchId }) => [
        { type: "Batches", id: `SESSIONS-${batchId}` },
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
  useInitializeBatchCurriculumMutation,
  useGetBatchSessionsQuery,
  useUpsertBatchSessionMutation,
  useRemoveBatchSessionMutation,
} = batchesApi;
