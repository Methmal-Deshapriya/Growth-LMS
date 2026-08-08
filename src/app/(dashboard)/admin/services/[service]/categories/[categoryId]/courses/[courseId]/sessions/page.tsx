"use client";

import { useParams } from "next/navigation";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";
import CourseCurriculumManager from "@/features/sessions/components/admin/CourseCurriculumManager";

export default function ContextCourseSessionsPage() {
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

  const coursesHref = `/admin/services/${service.slug}/categories/${categoryId}/courses`;
  const isArchived =
    course.status === "ARCHIVED" || course.category.status === "ARCHIVED";

  return (
    <div className="space-y-8 pb-20">
      <AdminCatalogBreadcrumbs crumbs={[
        { label: "Services", href: "/admin/services" },
        { label: service.label, href: `/admin/services/${service.slug}/categories` },
        { label: course.category.title, href: coursesHref },
        { label: course.title },
      ]} />
      <div>
        <h1 className="text-3xl font-bold">{course.title} sessions</h1>
        <p className="text-muted-foreground">
          Attach existing Session Library resources and manage only this course&apos;s curriculum order.
        </p>
      </div>
      <CourseCurriculumManager courseId={course.id} readOnly={isArchived} />
    </div>
  );
}
