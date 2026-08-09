"use client";

import { useParams } from "next/navigation";
import { AdminBatchDetails } from "@/features/batches/components/AdminBatchDetails";
import type { LearningServiceSlug } from "@/features/catalog/catalogTypes";

export default function ContextBatchPage() {
  const { service, categoryId, courseId, batchId } = useParams<{
    service: LearningServiceSlug;
    categoryId: string;
    courseId: string;
    batchId: string;
  }>();

  return (
    <AdminBatchDetails
      batchId={batchId}
      expectedContext={{ serviceSlug: service, categoryId, courseId }}
    />
  );
}
