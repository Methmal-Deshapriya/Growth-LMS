"use client";

import { useParams } from "next/navigation";
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { CategoryManager } from "@/features/catalog/components/CategoryManager";

export default function ServiceCategoriesPage() {
  const { service: serviceSlug } = useParams<{ service: string }>();
  const service = getAdminCatalogService(serviceSlug);

  if (!service) {
    return <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Unknown learning service.</p>;
  }

  return (
    <div className="space-y-6 pb-20">
      <AdminCatalogBreadcrumbs
        crumbs={[
          { label: "Services", href: "/admin/services" },
          { label: service.label },
        ]}
      />
      <CategoryManager
        key={service.type}
        serviceType={service.type}
        serviceSlug={service.slug}
        serviceLabel={service.label}
      />
    </div>
  );
}
