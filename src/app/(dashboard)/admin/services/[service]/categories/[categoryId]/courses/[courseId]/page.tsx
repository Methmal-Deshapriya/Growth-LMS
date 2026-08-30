"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { AdminCatalogPageHeader } from "@/features/catalog/components/AdminCatalogPageHeader";
import { IntakeTable } from "@/features/catalog/components/IntakeTable";
import { useGetCourseIntakesQuery, useGetCourseQuery } from "@/features/catalog/catalogApi";
import { Icons } from "@/lib/icons";
import { COURSE_ENROLLMENT_STATUS_STYLES } from "@/lib/statusColors";
import { formatLKR } from "@/lib/utils";

function enrollmentStatusLabel(status: string) {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function CourseDetailPage() {
  const {
    service: serviceSlug,
    categoryId,
    courseId,
  } = useParams<{ service: string; categoryId: string; courseId: string }>();
  const { data: course, isLoading: courseLoading } = useGetCourseQuery(courseId);
  const { data: intakesPage, isLoading: intakesLoading } = useGetCourseIntakesQuery(courseId);

  if (courseLoading || intakesLoading)
    return (
      <p role="status" aria-live="polite" className="py-16 text-center text-muted-foreground">
        Loading course…
      </p>
    );
  if (!course || course.categoryId !== categoryId || course.category.service.slug !== serviceSlug)
    return (
      <p className="rounded-xl bg-destructive/10 p-6 text-destructive">
        Course not found in this category.
      </p>
    );

  const service = course.category.service;
  const coursesHref = `/admin/services/${service.slug}/categories/${categoryId}/courses`;
  const intakes = intakesPage?.intakes ?? [];

  return (
    <div className="space-y-6 pb-20">
      <AdminCatalogBreadcrumbs
        crumbs={[
          { label: "Services", href: "/admin/services" },
          { label: service.title, href: `/admin/services/${service.slug}/categories` },
          { label: course.category.title, href: coursesHref },
          { label: course.title },
        ]}
      />

      <AdminCatalogPageHeader
        title={course.title}
        description={course.summary}
        icon={Icons.myCourses}
        badge={
          <Badge variant="outline" className={COURSE_ENROLLMENT_STATUS_STYLES[course.enrollmentStatus]}>
            {enrollmentStatusLabel(course.enrollmentStatus)}
          </Badge>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-input bg-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Price</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {service.accessType === "FREE" ? "Free" : formatLKR(course.price)}
          </p>
        </div>
        <div className="rounded-md border border-input bg-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Level</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{course.level}</p>
        </div>
        <div className="rounded-md border border-input bg-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Intakes</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{course.intakeCount}</p>
        </div>
      </div>

      <IntakeTable course={course} intakes={intakes} serviceSlug={service.slug} categoryId={categoryId} />
    </div>
  );
}
