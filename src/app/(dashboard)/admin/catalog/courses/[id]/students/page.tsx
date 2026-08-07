"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClassRosterTable from "@/features/enrollments/components/ClassRosterTable";
import { useGetCourseRosterQuery } from "@/features/enrollments/enrollmentsApi";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";
export default function CourseRosterPage() { const { id } = useParams<{ id: string }>(); const { data: course } = useGetAdminCourseQuery(id); const { data: roster, isLoading, isError } = useGetCourseRosterQuery(id); return <div className="space-y-8 pb-20"><div><Link className="text-sm font-semibold text-primary" href="/admin/catalog/courses">← Back to courses</Link><h1 className="mt-4 text-3xl font-bold">Class roster</h1><p className="text-muted-foreground">Students enrolled in {course?.title ?? "this course"}.</p></div>{isLoading ? <p>Loading students…</p> : isError ? <p className="text-destructive">Could not load the roster.</p> : roster?.length ? <ClassRosterTable entries={roster} /> : <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No students are enrolled yet.</p>}</div>; }
