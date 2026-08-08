"use client";

import { useParams } from "next/navigation";
import BatchManager from "@/features/batches/components/BatchManager";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";

export default function ContextCourseBatchesPage() {
  const { service: serviceSlug, categoryId, courseId } = useParams<{
    service: string;
    categoryId: string;
    courseId: string;
  }>();
  const service = getAdminCatalogService(serviceSlug);
  const { data: course, isLoading } = useGetAdminCourseQuery(courseId);

  if (isLoading) return <p className="py-16 text-center">Loading course...</p>;
  if (
    !service ||
    !course ||
    course.categoryId !== categoryId ||
    course.category.serviceType !== service.type
  ) {
    return <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Course not found in this category.</p>;
  }
  if (service.type === "FREE_LEARNING") {
    return <p className="rounded-xl border p-6">Free Learning courses do not use batches.</p>;
  }

  const coursesHref = `/admin/services/${service.slug}/categories/${categoryId}/courses`;
  const readOnly =
    course.status === "ARCHIVED" || course.category.status === "ARCHIVED";
  return (
    <div className="space-y-8 pb-20">
      <AdminCatalogBreadcrumbs crumbs={[
        { label: "Services", href: "/admin/services" },
        { label: service.label, href: `/admin/services/${service.slug}/categories` },
        { label: course.category.title, href: coursesHref },
        { label: `${course.title} batches` },
      ]} />
      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground">Manage paid intakes, rosters, and independent releases.</p>
      </div>
      <BatchManager courseId={course.id} readOnly={readOnly} />
    </div>
  );
}

