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
import { getAdminCatalogService } from "@/features/catalog/adminCatalogServices";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { AdminCatalogPageHeader } from "@/features/catalog/components/AdminCatalogPageHeader";
import { AdminSummaryStrip } from "@/features/catalog/components/AdminSummaryStrip";
import { CourseForm } from "@/features/catalog/components/CourseForm";
import { CourseTable } from "@/features/catalog/components/CourseTable";
import {
  useGetAdminCategoryQuery,
  useGetAdminCoursesQuery,
} from "@/features/catalog/catalogApi";

export default function CategoryCoursesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { service: serviceSlug, categoryId } = useParams<{
    service: string;
    categoryId: string;
  }>();
  const service = getAdminCatalogService(serviceSlug);
  const { data: category, isLoading: categoryLoading } =
    useGetAdminCategoryQuery(categoryId);
  const { data: courses, isLoading: coursesLoading, isError } =
    useGetAdminCoursesQuery({ categoryId });

  if (categoryLoading || coursesLoading) {
    return <p className="py-16 text-center text-muted-foreground">Loading courses...</p>;
  }
  if (!service || !category || category.serviceType !== service.type) {
    return <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Category not found in this service.</p>;
  }

  const courseList = courses?.courses ?? [];
  const activeCourseCount = courseList.filter(
    (course) => course.status !== "ARCHIVED",
  ).length;
  const publishedCount = courseList.filter(
    (course) => course.status === "PUBLISHED",
  ).length;
  const sessionCount = courseList.reduce(
    (total, course) => total + course.sessionCount,
    0,
  );
  const enrollmentCount = courseList.reduce(
    (total, course) => total + course.enrollmentCount,
    0,
  );
  const batchCount = courseList.reduce(
    (total, course) => total + course.batchCount,
    0,
  );

  return (
    <div className="space-y-6 pb-20">
      <AdminCatalogBreadcrumbs
        crumbs={[
          { label: "Services", href: "/admin/services" },
          {
            label: service.label,
            href: `/admin/services/${service.slug}/categories`,
          },
          { label: category.title },
        ]}
      />
      <AdminCatalogPageHeader
        title={`${category.title} courses`}
        description={
          category.serviceType === "FREE_LEARNING"
            ? "Create and manage the courses that belong to this category. Select a row to manage its sessions."
            : "Select a course row to manage its sessions, or use its chevron to view and open batches."
        }
        action={
          <Button
            disabled={category.status === "ARCHIVED"}
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="size-4" /> New course
          </Button>
        }
      />
      <AdminSummaryStrip
        items={[
          {
            label: "Courses",
            value: activeCourseCount,
            detail: `${courseList.length - activeCourseCount} archived`,
          },
          {
            label: "Published",
            value: publishedCount,
            detail: `${activeCourseCount - publishedCount} unpublished`,
          },
          {
            label: "Sessions",
            value: sessionCount,
            detail: "Active curriculum attachments",
          },
          {
            label:
              category.serviceType === "FREE_LEARNING"
                ? "Enrollments"
                : "Delivery",
            value:
              category.serviceType === "FREE_LEARNING"
                ? enrollmentCount
                : `${batchCount} / ${enrollmentCount}`,
            detail:
              category.serviceType === "FREE_LEARNING"
                ? "Across these courses"
                : "Batches / enrollments",
          },
        ]}
      />
      {isError ? (
        <p className="rounded-xl bg-destructive/10 p-6 text-destructive">
          Could not load courses.
        </p>
      ) : (
        <CourseTable
          courses={courseList}
          serviceSlug={service.slug}
          category={category}
        />
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>New course</DialogTitle>
            <DialogDescription>
              Create a course in {category.title}. It will start unpublished.
            </DialogDescription>
          </DialogHeader>
          <CourseForm
            key={category.id}
            lockedCategory={category}
            embedded
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
