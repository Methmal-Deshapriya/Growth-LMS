"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LibraryBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { AdminCatalogPageHeader } from "@/features/catalog/components/AdminCatalogPageHeader";
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
      <AdminCatalogPageHeader
        title={`${course.title} sessions`}
        description="Attach Session Library resources and manage this course's curriculum order."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/sessions">
              <LibraryBig /> Manage session library
            </Link>
          </Button>
        }
      />
      <CourseCurriculumManager
        courseId={course.id}
        serviceSlug={service.slug}
        categoryId={categoryId}
        readOnly={isArchived}
      />
    </div>
  );
}
