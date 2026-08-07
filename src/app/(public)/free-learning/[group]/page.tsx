import { notFound } from "next/navigation";
import { ApiCourseGrid } from "@/components/marketing/catalog/ApiCourseGrid";
import { getPublicCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ group: string }> }) { const category = await getPublicCategory("free-learning", (await params).group); return category ? { title: `${category.title} Free Learning | Foundry Academy`, description: category.description } : {}; }
export default async function FreeLearningCategoryPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const category = await getPublicCategory("free-learning", group);
  if (!category) notFound();
  return <ApiCourseGrid category={category} />;
}
