import { notFound } from "next/navigation";
import { ApiCourseDetail } from "@/components/marketing/catalog/ApiCourseDetail";
import { getPublicCourse } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ group: string; course: string }> }) { const values = await params; const course = await getPublicCourse("bootcamps", values.group, values.course); return course ? { title: `${course.title} | Foundry Academy`, description: course.summary } : {}; }
export default async function BootcampCoursePage({ params }: { params: Promise<{ group: string; course: string }> }) {
  const { group, course: courseSlug } = await params;
  const course = await getPublicCourse("bootcamps", group, courseSlug);
  if (!course) notFound();
  return <ApiCourseDetail course={course} />;
}
