"use client";

import { useParams } from "next/navigation";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { CourseForm } from "@/features/catalog/components/CourseForm";
import { useGetAdminCategoryQuery } from "@/features/catalog/catalogApi";

export default function NewContextCoursePage() {
  const { service: serviceSlug, categoryId } = useParams<{
    service: string;
    categoryId: string;
  }>();
  const service = getAdminCatalogService(serviceSlug);
  const { data: category, isLoading } = useGetAdminCategoryQuery(categoryId);

  if (isLoading) return <p className="py-16 text-center">Loading category...</p>;
  if (!service || !category || category.serviceType !== service.type) {
    return <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Category not found in this service.</p>;
  }
  if (category.status === "ARCHIVED") {
    return <p className="rounded-xl border p-6">Archived categories cannot accept new courses.</p>;
  }

  const coursesHref = `/admin/services/${service.slug}/categories/${category.id}/courses`;
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <AdminCatalogBreadcrumbs crumbs={[
        { label: "Services", href: "/admin/services" },
        { label: service.label, href: `/admin/services/${service.slug}/categories` },
        { label: category.title, href: coursesHref },
        { label: "New course" },
      ]} />
      <div>
        <h1 className="text-3xl font-bold">Create course</h1>
        <p className="text-muted-foreground">The new draft will belong to {category.title}.</p>
      </div>
      <CourseForm
        key={category.id}
        lockedCategory={category}
        returnHref={coursesHref}
      />
    </div>
  );
}
