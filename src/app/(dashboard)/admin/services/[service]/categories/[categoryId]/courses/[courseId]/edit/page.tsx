"use client";

import { useParams } from "next/navigation";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { CourseForm } from "@/features/catalog/components/CourseForm";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";

export default function EditContextCoursePage() {
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
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <AdminCatalogBreadcrumbs crumbs={[
        { label: "Services", href: "/admin/services" },
        { label: service.label, href: `/admin/services/${service.slug}/categories` },
        { label: course.category.title, href: coursesHref },
        { label: course.title },
      ]} />
      <div>
        <h1 className="text-3xl font-bold">Edit {course.title}</h1>
        <p className="text-muted-foreground">The course remains attached to {course.category.title}.</p>
      </div>
      <CourseForm
        initial={course}
        lockedCategory={course.category}
        returnHref={coursesHref}
      />
    </div>
  );
}

