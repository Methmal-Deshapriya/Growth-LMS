"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BatchDeliveryManager from "./BatchDeliveryManager";
import { BatchLifecycleControls } from "./BatchLifecycleControls";
import { useGetBatchQuery } from "../batchesApi";
import ManualEnrollmentForm from "@/features/enrollments/components/ManualEnrollmentForm";
import ClassRosterTable from "@/features/enrollments/components/ClassRosterTable";
import { useGetBatchRosterQuery } from "@/features/enrollments/enrollmentsApi";
import { getAdminCatalogServiceByType } from "@/features/catalog/adminCatalogServices";
import type { LearningServiceSlug } from "@/features/catalog/catalogTypes";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { AdminCatalogPageHeader } from "@/features/catalog/components/AdminCatalogPageHeader";

interface BatchRouteContext {
  serviceSlug: LearningServiceSlug;
  categoryId: string;
  courseId: string;
}

export function AdminBatchDetails({
  batchId,
  expectedContext,
}: {
  batchId: string;
  expectedContext?: BatchRouteContext;
}) {
  const { data: batch, isLoading } = useGetBatchQuery(batchId);
  const { data: roster = [], isLoading: rosterLoading } =
    useGetBatchRosterQuery(batchId);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="py-16 text-center text-muted-foreground"
      >
        Loading batch...
      </p>
    );
  }
  if (!batch) return <p role="alert">Batch not found.</p>;

  const service = getAdminCatalogServiceByType(batch.course.category.serviceType);
  const hasExpectedContext =
    !expectedContext ||
    (expectedContext.serviceSlug === service?.slug &&
      expectedContext.categoryId === batch.course.category.id &&
      expectedContext.courseId === batch.courseId);

  if (!service || !hasExpectedContext) {
    return (
      <p
        role="alert"
        className="rounded-xl bg-destructive/10 p-6 text-destructive"
      >
        Batch not found in this course.
      </p>
    );
  }

  const coursesHref = `/admin/services/${service.slug}/categories/${batch.course.category.id}/courses`;
  const courseHref = `${coursesHref}/${batch.courseId}/sessions`;
  const acceptsEnrollment = ["ENROLLING", "ACTIVE"].includes(batch.status);

  return (
    <div className="space-y-8 pb-20">
      <AdminCatalogBreadcrumbs
        crumbs={[
          { label: "Services", href: "/admin/services" },
          {
            label: service.label,
            href: `/admin/services/${service.slug}/categories`,
          },
          { label: batch.course.category.title, href: coursesHref },
          { label: batch.course.title, href: courseHref },
          { label: batch.name },
        ]}
      />
      <AdminCatalogPageHeader
        title={batch.name}
        description={`${batch.course.title} · ${batch.code} · ${batch.enrollmentCount} learners`}
        action={<BatchLifecycleControls batch={batch} />}
      />
      {batch.completionReadiness ? (
        <section className="grid gap-3 md:grid-cols-3">
          <ReadinessItem
            label="Curriculum released"
            value={`${batch.completionReadiness.curriculum.releasedAndAvailable} / ${batch.completionReadiness.curriculum.total}`}
            ready={batch.completionReadiness.curriculum.ready}
          />
          <ReadinessItem
            label="Enrollments completed"
            value={`${batch.completionReadiness.enrollments.completed} / ${batch.completionReadiness.enrollments.total}`}
            ready={batch.completionReadiness.enrollments.ready}
          />
          <ReadinessItem
            label={
              batch.completionReadiness.certificates.required
                ? "Certificates issued"
                : "Certificates"
            }
            value={
              !batch.completionReadiness.certificates.enabled
                ? "Enable certificates"
                : batch.completionReadiness.certificates.required
                ? `${batch.completionReadiness.certificates.issued} / ${batch.completionReadiness.enrollments.total}`
                : "Not required"
            }
            ready={batch.completionReadiness.certificates.ready}
          />
        </section>
      ) : null}
      <BatchDeliveryManager
        batchId={batchId}
        courseId={batch.courseId}
        batchStatus={batch.status}
      />
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Batch roster</h2>
            <p className="text-sm text-muted-foreground">
              External payment evidence and learner lifecycle are managed per intake.
            </p>
          </div>
          {acceptsEnrollment ? (
            <Button size="sm" onClick={() => setEnrollDialogOpen(true)}>
              <UserPlus className="size-4" /> Add student
            </Button>
          ) : null}
        </div>
        {!acceptsEnrollment ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            This batch status does not accept new enrollment.
          </p>
        ) : null}
        <ClassRosterTable entries={roster} isLoading={rosterLoading} />
      </section>

      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add paid students</DialogTitle>
            <DialogDescription>
              Search verified accounts, select one or many, then record the
              external payment result.
            </DialogDescription>
          </DialogHeader>
          <ManualEnrollmentForm
            batchId={batchId}
            onSuccess={() => setEnrollDialogOpen(false)}
            onCancel={() => setEnrollDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReadinessItem({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="rounded-md border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="font-mono font-semibold tabular-nums">{value}</p>
        <span
          className={
            ready
              ? "text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              : "text-xs font-semibold text-amber-600 dark:text-amber-400"
          }
        >
          {ready ? "Ready" : "Pending"}
        </span>
      </div>
    </div>
  );
}
