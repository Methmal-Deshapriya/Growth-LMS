"use client";

import BatchDeliveryManager from "./BatchDeliveryManager";
import { BatchStatusBadge } from "./BatchStatusBadge";
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

  if (isLoading) {
    return <p className="py-16 text-center text-muted-foreground">Loading batch...</p>;
  }
  if (!batch) return <p>Batch not found.</p>;

  const service = getAdminCatalogServiceByType(batch.course.category.serviceType);
  const hasExpectedContext =
    !expectedContext ||
    (expectedContext.serviceSlug === service?.slug &&
      expectedContext.categoryId === batch.course.category.id &&
      expectedContext.courseId === batch.courseId);

  if (!service || !hasExpectedContext) {
    return (
      <p className="rounded-xl bg-destructive/10 p-6 text-destructive">
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
        action={<BatchStatusBadge status={batch.status} />}
      />
      <BatchDeliveryManager
        batchId={batchId}
        courseId={batch.courseId}
        batchStatus={batch.status}
      />
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Batch roster</h2>
          <p className="text-sm text-muted-foreground">
            External payment evidence and learner lifecycle are managed per intake.
          </p>
        </div>
        {acceptsEnrollment ? (
          <ManualEnrollmentForm batchId={batchId} />
        ) : (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            This batch status does not accept new enrollment.
          </p>
        )}
        {rosterLoading ? (
          <p>Loading roster...</p>
        ) : roster.length ? (
          <ClassRosterTable entries={roster} />
        ) : (
          <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            No learners enrolled in this batch.
          </p>
        )}
      </section>
    </div>
  );
}
