"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";
import BatchManager from "@/features/batches/components/BatchManager";

export default function CourseBatchesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading } = useGetAdminCourseQuery(id);
  if (isLoading) return <p className="py-16 text-center text-muted-foreground">Loading course…</p>;
  if (!course) return <p>Course not found.</p>;
  if (course.category.serviceType === "FREE_LEARNING") return <div className="space-y-4"><Link className="text-sm font-semibold text-primary" href="/admin/catalog/courses">Back to courses</Link><p className="rounded-xl border p-6">Free Learning courses do not use batches. Manage their live curriculum and course learner list instead.</p></div>;
  const readOnly = course.status === "ARCHIVED" || course.category.status === "ARCHIVED";
  return <div className="space-y-8 pb-20"><div><Link className="text-sm font-semibold text-primary" href="/admin/catalog/courses">Back to courses</Link><h1 className="mt-4 text-3xl font-bold">{course.title}</h1><p className="text-muted-foreground">Manage paid intakes, their rosters, and independent weekly releases.</p></div><BatchManager courseId={id} readOnly={readOnly} /></div>;
}
