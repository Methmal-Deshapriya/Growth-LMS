import { notFound } from "next/navigation";
import { ApiCourseDetail } from "@/components/marketing/catalog/ApiCourseDetail";
import { getPublicCourse } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; group: string; course: string }>;
}) {
  const { service, group, course } = await params;
  const detail = await getPublicCourse(service, group, course);
  return detail
    ? {
        title: `${detail.title} | Foundry Academy`,
        description: detail.summary,
      }
    : {};
}

export default async function PublicCoursePage({
  params,
}: {
  params: Promise<{ service: string; group: string; course: string }>;
}) {
  const { service, group, course } = await params;
  const detail = await getPublicCourse(service, group, course);
  if (!detail) notFound();
  return <ApiCourseDetail course={detail} />;
}
