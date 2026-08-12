"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetBatchQuery } from "@/features/batches/batchesApi";
import { getAdminCatalogServiceByType } from "@/features/catalog/adminCatalogServices";

export default function LegacyAdminBatchPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: batch, isLoading, isError } = useGetBatchQuery(id);
  const service = batch
    ? getAdminCatalogServiceByType(batch.course.category.serviceType)
    : null;

  useEffect(() => {
    if (!batch || !service) return;
    router.replace(
      `/admin/services/${service.slug}/categories/${batch.course.category.id}/courses/${batch.courseId}/batches/${batch.id}`,
    );
  }, [batch, router, service]);

  if (isError || (!isLoading && (!batch || !service))) {
    return (
      <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-6 text-destructive">
        This legacy batch link could not be resolved. Open Services to find its course.
      </p>
    );
  }

  return (
    <p role="status" aria-live="polite" className="py-16 text-center text-muted-foreground">
      Redirecting to the current batch workspace…
    </p>
  );
}
