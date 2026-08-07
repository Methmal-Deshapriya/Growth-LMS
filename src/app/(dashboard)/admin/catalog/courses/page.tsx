"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CatalogNavigation } from "@/features/catalog/components/CatalogNavigation";
import { CourseTable } from "@/features/catalog/components/CourseTable";
import { useGetAdminCoursesQuery } from "@/features/catalog/catalogApi";

export default function AdminCoursesPage() {
  const { data, isLoading, isError } = useGetAdminCoursesQuery();
  return <div className="space-y-6 pb-20"><div className="flex items-end justify-between gap-4"><div><h1 className="text-3xl font-bold">Course catalog</h1><p className="mt-1 text-muted-foreground">Manage course content, delivery sessions, access, and publication.</p></div><Button asChild><Link href="/admin/catalog/courses/new">New course</Link></Button></div><CatalogNavigation />{isLoading ? <p className="py-16 text-center text-muted-foreground">Loading courses…</p> : isError ? <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Could not load the course catalog.</p> : <CourseTable courses={data?.courses ?? []} />}</div>;
}
