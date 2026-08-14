"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";
import ClassRosterTable from "@/features/enrollments/components/ClassRosterTable";
import { useGetCourseRosterQuery } from "@/features/enrollments/enrollmentsApi";
import { CursorPagination } from "@/components/ui/cursor-pagination";

export default function ContextCourseLearnersPage() {
  const { service: serviceSlug, categoryId, courseId } = useParams<{
    service: string;
    categoryId: string;
    courseId: string;
  }>();
  const service = getAdminCatalogService(serviceSlug);
  const { data: course, isLoading: courseLoading } = useGetAdminCourseQuery(courseId);
  const [rosterCursors, setRosterCursors] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const rosterPage = rosterCursors.length - 1;
  const {
    data: rosterData,
    isLoading: rosterLoading,
    isFetching: rosterFetching,
    isError,
  } = useGetCourseRosterQuery({
    courseId,
    cursor: rosterCursors[rosterPage],
    limit: 50,
  });

  if (courseLoading) return <p className="py-16 text-center">Loading learners...</p>;
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
        <p role="alert" className="text-destructive">Could not load the roster.</p>
      ) : (
        <ClassRosterTable
          entries={rosterData?.enrollments ?? []}
          isLoading={rosterLoading}
          deliveryMode="SELF_PACED"
          certificateEnabled={course.certificateEnabled}
        />
      )}
      {!isError ? (
        <CursorPagination
          page={rosterPage}
          hasMore={rosterData?.pagination.hasMore ?? false}
          isFetching={rosterFetching}
          onPrevious={() =>
            setRosterCursors((current) => current.slice(0, -1))
          }
          onNext={() => {
            const nextCursor = rosterData?.pagination.nextCursor;
            if (nextCursor) {
              setRosterCursors((current) => [...current, nextCursor]);
            }
          }}
        />
      ) : null}
    </div>
  );
}
