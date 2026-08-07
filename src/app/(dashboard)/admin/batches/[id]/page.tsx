"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import BatchDeliveryManager from "@/features/batches/components/BatchDeliveryManager";
import { useGetBatchQuery } from "@/features/batches/batchesApi";
import ManualEnrollmentForm from "@/features/enrollments/components/ManualEnrollmentForm";
import ClassRosterTable from "@/features/enrollments/components/ClassRosterTable";
import { useGetBatchRosterQuery } from "@/features/enrollments/enrollmentsApi";

export default function AdminBatchPage() {
  const { id } = useParams<{ id: string }>();
  const { data: batch, isLoading } = useGetBatchQuery(id);
  const { data: roster = [], isLoading: rosterLoading } = useGetBatchRosterQuery(id);
  if (isLoading) return <p className="py-16 text-center text-muted-foreground">Loading batch…</p>;
  if (!batch) return <p>Batch not found.</p>;
  const acceptsEnrollment = ["ENROLLING", "ACTIVE"].includes(batch.status);
  return <div className="space-y-10 pb-20"><div><Link className="text-sm font-semibold text-primary" href={`/admin/catalog/courses/${batch.courseId}/batches`}>Back to course batches</Link><div className="mt-4 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold">{batch.name}</h1><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{batch.status}</span></div><p className="mt-1 text-muted-foreground">{batch.course.title} · {batch.code} · {batch.enrollmentCount} learners</p></div><BatchDeliveryManager batchId={id} courseId={batch.courseId} batchStatus={batch.status} /><section className="space-y-5"><div><h2 className="text-xl font-bold">Batch roster</h2><p className="text-sm text-muted-foreground">External payment evidence and learner lifecycle are managed per intake.</p></div>{acceptsEnrollment ? <ManualEnrollmentForm batchId={id} /> : <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">This batch status does not accept new enrollment.</p>}{rosterLoading ? <p>Loading roster…</p> : roster.length ? <ClassRosterTable entries={roster} /> : <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No learners enrolled in this batch.</p>}</section></div>;
}
