import { redirect } from "next/navigation";

export default async function LegacyContextNewCoursePage({
  params,
}: {
  params: Promise<{ service: string; categoryId: string }>;
}) {
  const { service, categoryId } = await params;
  redirect(`/admin/services/${service}/categories/${categoryId}/courses`);
}
