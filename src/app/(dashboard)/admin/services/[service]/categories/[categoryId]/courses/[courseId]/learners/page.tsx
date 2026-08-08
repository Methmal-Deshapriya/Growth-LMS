"use client";

import { useParams } from "next/navigation";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";
import ClassRosterTable from "@/features/enrollments/components/ClassRosterTable";
import { useGetCourseRosterQuery } from "@/features/enrollments/enrollmentsApi";

export default function ContextCourseLearnersPage() {
  const { service: serviceSlug, categoryId, courseId } = useParams<{
    service: string;
    categoryId: string;
    courseId: string;
  }>();
  const service = getAdminCatalogService(serviceSlug);
  const { data: course, isLoading: courseLoading } = useGetAdminCourseQuery(courseId);
  const { data: roster, isLoading, isError } = useGetCourseRosterQuery(courseId);

  if (courseLoading || isLoading) return <p className="py-16 text-center">Loading learners...</p>;
  if (
    !service ||
    !course ||
    course.categoryId !== categoryId ||
    course.category.serviceType !== service.type
  ) {
    return <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Course not found in this category.</p>;
  }
  if (service.type !== "FREE_LEARNING") {
    return <p className="rounded-xl border p-6">Paid course learners are managed through individual batch rosters.</p>;
  }

  const coursesHref = `/admin/services/${service.slug}/categories/${categoryId}/courses`;
  return (
    <div className="space-y-8 pb-20">
      <AdminCatalogBreadcrumbs crumbs={[
        { label: "Services", href: "/admin/services" },
        { label: service.label, href: `/admin/services/${service.slug}/categories` },
        { label: course.category.title, href: coursesHref },
        { label: `${course.title} learners` },
      ]} />
      <div>
        <h1 className="text-3xl font-bold">Course learners</h1>
        <p className="text-muted-foreground">Students enrolled in {course.title}.</p>
      </div>
      {isError ? (
        <p className="text-destructive">Could not load the roster.</p>
      ) : roster?.length ? (
        <ClassRosterTable entries={roster} />
      ) : (
        <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No students are enrolled yet.</p>
      )}
    </div>
  );
}
