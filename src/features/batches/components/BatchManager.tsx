"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAdminCatalogServiceByType } from "@/features/catalog/adminCatalogServices";
import { getApiErrorMessage } from "@/lib/api";
import {
  useGetCourseBatchesQuery,
  useUpdateBatchStatusMutation,
} from "../batchesApi";
import type { BatchStatus } from "../batchesTypes";
import { BatchForm } from "./BatchForm";

const transitions: Record<BatchStatus, BatchStatus[]> = {
  DRAFT: ["ENROLLING", "CANCELLED", "ARCHIVED"],
  ENROLLING: ["DRAFT", "ACTIVE", "CANCELLED", "ARCHIVED"],
  ACTIVE: ["COMPLETED", "CANCELLED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

export default function BatchManager({ courseId, readOnly }: { courseId: string; readOnly: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError } = useGetCourseBatchesQuery(courseId);
  const [updateStatus] = useUpdateBatchStatusMutation();

  const transition = async (batchId: string, status: BatchStatus) => {
    if (!window.confirm(`Move this batch to ${status}?`)) return;
    try {
      await updateStatus({ batchId, status }).unwrap();
      toast.success(`Batch moved to ${status}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update batch status"));
    }
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Paid course batches</h2><p className="text-sm text-muted-foreground">Each intake has its own roster and lesson releases.</p></div>{!readOnly ? <Button onClick={() => setShowForm((value) => !value)}><Plus className="mr-2 h-4 w-4" />New batch</Button> : null}</div>
    {showForm ? <div className="rounded-2xl border border-border bg-card p-6"><BatchForm courseId={courseId} onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} /></div> : null}
    {isLoading ? <p className="py-12 text-center text-muted-foreground">Loading batches…</p> : null}
    {isError ? <p className="rounded-xl bg-destructive/10 p-5 text-destructive">Could not load batches.</p> : null}
    <div className="grid gap-4 md:grid-cols-2">
      {data?.batches.map((batch) => {
        const service = getAdminCatalogServiceByType(batch.course.category.serviceType);
        const href = service ? `/admin/services/${service.slug}/categories/${batch.course.category.id}/courses/${batch.courseId}/batches/${batch.id}` : `/admin/batches/${batch.id}`;
        return <article key={batch.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{batch.status}</span><h3 className="mt-3 text-lg font-bold">{batch.name}</h3><p className="font-mono text-xs text-muted-foreground">{batch.code}</p></div><Button asChild size="sm"><Link href={href}>Open delivery</Link></Button></div><p className="mt-4 text-sm text-muted-foreground">{batch.enrollmentCount} learners · {batch.sessionCount} lessons · {batch.startDate.slice(0, 10)} to {batch.expectedEndDate.slice(0, 10)}</p>{!readOnly && transitions[batch.status].length ? <div className="mt-4 flex flex-wrap gap-2">{transitions[batch.status].map((status) => <Button key={status} size="sm" variant="outline" onClick={() => transition(batch.id, status)}>Move to {status}</Button>)}</div> : null}</article>;
      })}
      {!isLoading && data?.batches.length === 0 ? <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground md:col-span-2">No paid batches created yet.</p> : null}
    </div>
  </div>;
}
