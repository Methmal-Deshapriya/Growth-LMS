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
import { CourseGroupForm } from "@/features/catalog/components/CourseGroupForm";
import { CourseTable } from "@/features/catalog/components/CourseTable";
import {
  useGetAdminCategoryQuery,
  useGetCourseGroupsQuery,
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
    isLoading: groupsLoading,
    isError,
  } = useGetCourseGroupsQuery({ categoryId, includeArchived: true });

  if (categoryLoading || groupsLoading)
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

  const groups = data?.courseGroups ?? [];
  const courses = groups.flatMap((group) => group.courses);
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
        description="CourseGroup keeps matching real-world courses together internally. Each Course row is one independently delivered intake or evergreen course."
        action={
          <Button
            disabled={category.status === "ARCHIVED"}
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus /> New real-world course
          </Button>
        }
      />
      <AdminSummaryStrip
        items={[
          {
            label: "Course groups",
            value: groups.filter((group) => !group.archivedAt).length,
            detail: `${groups.filter((group) => group.archivedAt).length} archived`,
          },
          {
            label: "Course records",
            value: courses.length,
            detail: `${courses.filter((course) => course.status === "OPEN_ACTIVE").length} public/open`,
          },
          {
            label: "Active teaching",
            value: courses.filter((course) =>
              ["OPEN_ACTIVE", "CLOSED_ACTIVE"].includes(course.status),
            ).length,
            detail: "Open and closed-active",
          },
          {
            label: "Learners",
            value: courses.reduce(
              (total, course) => total + course.enrollmentCount,
              0,
            ),
            detail: "Across every intake",
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
          groups={groups}
          serviceSlug={service.slug}
          category={category}
        />
      )}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New real-world course</DialogTitle>
            <DialogDescription>
              Create the internal grouping first. Its first Course record is
              created from the grouped table.
            </DialogDescription>
          </DialogHeader>
          <CourseGroupForm
            category={category}
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
