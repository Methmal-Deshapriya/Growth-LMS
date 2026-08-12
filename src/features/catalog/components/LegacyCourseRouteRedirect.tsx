"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminCatalogServiceByType } from "../adminCatalogServices";
import { useGetAdminCourseQuery } from "../catalogApi";

type LegacyDestination = "edit" | "sessions" | "students";

export function LegacyCourseRouteRedirect({
  courseId,
  destination,
}: {
  courseId: string;
  destination: LegacyDestination;
}) {
  const router = useRouter();
  const { data: course, isLoading, isError } = useGetAdminCourseQuery(courseId);
  const service = course
    ? getAdminCatalogServiceByType(course.category.serviceType)
    : null;

  useEffect(() => {
    if (!course || !service) return;

    const courseBase = `/admin/services/${service.slug}/categories/${course.categoryId}/courses/${course.id}`;
    const target =
      destination === "edit"
        ? `${courseBase}/edit`
        : destination === "students" &&
            course.category.serviceType === "FREE_LEARNING"
          ? `${courseBase}/learners`
          : `${courseBase}/sessions`;

    router.replace(target);
  }, [course, destination, router, service]);

  if (isError || (!isLoading && (!course || !service))) {
    return (
      <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-6 text-destructive">
        This legacy course link could not be resolved. Open Services to find the course.
      </p>
    );
  }

  return (
    <p role="status" aria-live="polite" className="py-16 text-center text-muted-foreground">
      Redirecting to the current course workspace…
    </p>
  );
}
