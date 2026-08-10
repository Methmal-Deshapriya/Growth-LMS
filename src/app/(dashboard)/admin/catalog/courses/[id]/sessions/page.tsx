"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CourseCurriculumManager from "@/features/sessions/components/admin/CourseCurriculumManager";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";
import { getAdminCatalogServiceByType } from "@/features/catalog/adminCatalogServices";

export default function AdminCourseSessionsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetAdminCourseQuery(id);

  if (isLoading) {
    return <p className="py-16 text-center">Loading course…</p>;
  }

  if (!data) return <p>Course not found.</p>;

  const isArchived =
    data.status === "ARCHIVED" || data.category.status === "ARCHIVED";
  const service = getAdminCatalogServiceByType(data.category.serviceType);

  if (!service) return <p>Course service not found.</p>;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/catalog/courses">Back to courses</Link>
        </Button>
        <h1 className="mt-4 text-3xl font-bold">{data.title}</h1>
        <p className="text-muted-foreground">
          {isArchived
            ? "Review the preserved curriculum for this archived course."
            : "Attach Session Library resources and define the course's master order."}
        </p>
      </div>
      <CourseCurriculumManager
        courseId={id}
        serviceSlug={service.slug}
        categoryId={data.categoryId}
        readOnly={isArchived}
      />
    </div>
  );
}
