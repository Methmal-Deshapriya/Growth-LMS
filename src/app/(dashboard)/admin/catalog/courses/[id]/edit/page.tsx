"use client";
import { useParams } from "next/navigation";
import { CourseForm } from "@/features/catalog/components/CourseForm";
import { useGetAdminCourseQuery } from "@/features/catalog/catalogApi";
export default function EditCoursePage() { const { id } = useParams<{ id: string }>(); const { data, isLoading, isError } = useGetAdminCourseQuery(id); if (isLoading) return <p className="py-16 text-center">Loading course…</p>; if (isError || !data) return <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Course not found.</p>; return <div className="mx-auto max-w-5xl space-y-6 pb-20"><div><h1 className="text-3xl font-bold">Edit {data.title}</h1><p className="text-muted-foreground">Published course URLs and category ownership are locked until the course is unpublished.</p></div><CourseForm initial={data} /></div>; }
