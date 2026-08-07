"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import {
  useCreateBatchMutation,
  useGetCourseBatchesQuery,
  useUpdateBatchStatusMutation,
} from "../batchesApi";
import type { BatchInput, BatchStatus } from "../batchesTypes";

const transitions: Record<BatchStatus, BatchStatus[]> = {
  DRAFT: ["ENROLLING", "CANCELLED", "ARCHIVED"],
  ENROLLING: ["DRAFT", "ACTIVE", "CANCELLED", "ARCHIVED"],
  ACTIVE: ["COMPLETED", "CANCELLED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

const empty: BatchInput = {
  name: "",
  code: "",
  startDate: "",
  expectedEndDate: "",
  timezone: "Asia/Colombo",
  capacity: null,
  initializeCurriculum: true,
};

export default function BatchManager({ courseId, readOnly }: { courseId: string; readOnly: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BatchInput>(empty);
  const { data, isLoading, isError } = useGetCourseBatchesQuery(courseId);
  const [createBatch, createState] = useCreateBatchMutation();
  const [updateStatus] = useUpdateBatchStatusMutation();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await createBatch({ courseId, data: form }).unwrap();
      toast.success(`Batch created with ${result.initializedSessionCount} hidden session(s)`);
      setForm(empty);
      setShowForm(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create batch"));
    }
  };

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
    {showForm ? <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
      <div className="space-y-2"><Label htmlFor="batch-name">Name</Label><Input id="batch-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="August 2026" /></div>
      <div className="space-y-2"><Label htmlFor="batch-code">Code</Label><Input id="batch-code" required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="ML1-2026-AUG" /></div>
      <div className="space-y-2"><Label htmlFor="batch-start">Start date</Label><Input id="batch-start" required type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></div>
      <div className="space-y-2"><Label htmlFor="batch-end">Expected end</Label><Input id="batch-end" required type="date" value={form.expectedEndDate} onChange={(event) => setForm({ ...form, expectedEndDate: event.target.value })} /></div>
      <div className="space-y-2"><Label htmlFor="batch-capacity">Capacity</Label><Input id="batch-capacity" type="number" min={1} value={form.capacity ?? ""} onChange={(event) => setForm({ ...form, capacity: event.target.value ? Number(event.target.value) : null })} /></div>
      <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" checked={form.initializeCurriculum} onChange={(event) => setForm({ ...form, initializeCurriculum: event.target.checked })} />Copy current curriculum as hidden lessons</label>
      <div className="flex gap-2 md:col-span-2"><Button type="submit" disabled={createState.isLoading}>{createState.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Create draft batch</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
    </form> : null}
    {isLoading ? <p className="py-12 text-center text-muted-foreground">Loading batches…</p> : null}
    {isError ? <p className="rounded-xl bg-destructive/10 p-5 text-destructive">Could not load batches.</p> : null}
    <div className="grid gap-4 md:grid-cols-2">
      {data?.batches.map((batch) => <article key={batch.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{batch.status}</span><h3 className="mt-3 text-lg font-bold">{batch.name}</h3><p className="font-mono text-xs text-muted-foreground">{batch.code}</p></div><Button asChild size="sm"><Link href={`/admin/batches/${batch.id}`}>Open delivery</Link></Button></div><p className="mt-4 text-sm text-muted-foreground">{batch.enrollmentCount} learners · {batch.sessionCount} lessons · {batch.startDate.slice(0, 10)} to {batch.expectedEndDate.slice(0, 10)}</p>{!readOnly && transitions[batch.status].length ? <div className="mt-4 flex flex-wrap gap-2">{transitions[batch.status].map((status) => <Button key={status} size="sm" variant="outline" onClick={() => transition(batch.id, status)}>Move to {status}</Button>)}</div> : null}</article>)}
      {!isLoading && data?.batches.length === 0 ? <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground md:col-span-2">No paid batches created yet.</p> : null}
    </div>
  </div>;
}
