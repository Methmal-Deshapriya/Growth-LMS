"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { AdminCatalogPageHeader } from "@/features/catalog/components/AdminCatalogPageHeader";
import { AdminSummaryStrip } from "@/features/catalog/components/AdminSummaryStrip";
import { CourseForm } from "@/features/catalog/components/CourseForm";
import { CourseTable } from "@/features/catalog/components/CourseTable";
import {
  useGetAdminCategoryQuery,
  useGetCoursesQuery,
} from "@/features/catalog/catalogApi";

export default function CategoryCoursesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { service: serviceSlug, categoryId } = useParams<{
    service: string;
    categoryId: string;
  }>();
  const { data: category, isLoading: categoryLoading } =
    useGetAdminCategoryQuery(categoryId);
  const {
    data,
    isLoading: coursesLoading,
    isError,
  } = useGetCoursesQuery({ categoryId, includeArchived: true });

  if (categoryLoading || coursesLoading)
    return (
      <p
        role="status"
        aria-live="polite"
        className="py-16 text-center text-muted-foreground"
      >
        Loading courses…
      </p>
    );
  if (!category || category.service.slug !== serviceSlug)
    return (
      <p className="rounded-xl bg-destructive/10 p-6 text-destructive">
        Category not found in this service.
      </p>
    );
  const service = category.service;

  const courses = data?.courses ?? [];
  return (
    <div className="space-y-6 pb-20">
      <AdminCatalogBreadcrumbs
        crumbs={[
          { label: "Services", href: "/admin/services" },
          {
            label: service.title,
            href: `/admin/services/${service.slug}/categories`,
          },
          { label: category.title },
        ]}
      />
      <AdminCatalogPageHeader
        title={`${category.title} courses`}
        description="Each course here is a real-world program students browse and enroll in. Its intakes are the scheduled runs — sessions, enrollments, and lifecycle live there."
        action={
          <Button
            disabled={category.status === "ARCHIVED"}
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus /> New course
          </Button>
        }
      />
      <AdminSummaryStrip
        items={[
          {
            label: "Courses",
            value: courses.filter((course) => !course.archivedAt).length,
            detail: `${courses.filter((course) => course.archivedAt).length} archived`,
          },
          {
            label: "Open for enrollment",
            value: courses.filter((course) => course.enrollmentStatus === "OPEN").length,
            detail: "Have an open-active intake",
          },
          {
            label: "Total intakes",
            value: courses.reduce((total, course) => total + course.intakeCount, 0),
            detail: "Across every course",
          },
        ]}
      />
      {isError ? (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 p-6 text-destructive"
        >
          Could not load courses.
        </p>
      ) : (
        <CourseTable
          courses={courses}
          serviceSlug={service.slug}
          category={category}
        />
      )}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New course</DialogTitle>
            <DialogDescription>
              This is what students browse and enroll in. Add its first intake next.
            </DialogDescription>
          </DialogHeader>
          <CourseForm
            category={category}
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
