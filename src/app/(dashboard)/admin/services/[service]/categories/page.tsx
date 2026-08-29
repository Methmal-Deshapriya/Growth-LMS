"use client";

import { useParams } from "next/navigation";
import { useGetAdminLearningServiceSummariesQuery } from "@/features/catalog/catalogApi";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { CategoryManager } from "@/features/catalog/components/CategoryManager";

export default function ServiceCategoriesPage() {
  const { service: serviceSlug } = useParams<{ service: string }>();
  const { data, isLoading } = useGetAdminLearningServiceSummariesQuery();
  const service = data?.services.find((item) => item.slug === serviceSlug);

  if (isLoading) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="py-16 text-center text-muted-foreground"
      >
        Loading learning service…
      </p>
    );
  }

  if (!service) {
    return (
      <p className="rounded-xl bg-destructive/10 p-6 text-destructive">
        Unknown learning service.
      </p>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <AdminCatalogBreadcrumbs
        crumbs={[
          { label: "Services", href: "/admin/services" },
          { label: service.title },
        ]}
      />
      <CategoryManager key={service.id} service={service} />
    </div>
  );
}
