import { notFound } from "next/navigation";
import { ApiCourseGrid } from "@/components/marketing/catalog/ApiCourseGrid";
import { getPublicCategory } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; group: string }>;
}) {
  const { service, group } = await params;
  const category = await getPublicCategory(service, group);
  return category
    ? {
        title: `${category.title} | Foundry Academy`,
        description: category.description,
      }
    : {};
}

export default async function PublicCategoryPage({
  params,
}: {
  params: Promise<{ service: string; group: string }>;
}) {
  const { service, group } = await params;
  const category = await getPublicCategory(service, group);
  if (!category) notFound();
  return <ApiCourseGrid category={category} />;
}
