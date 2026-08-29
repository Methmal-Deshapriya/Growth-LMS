"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LibraryBig, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { AdminCatalogPageHeader } from "@/features/catalog/components/AdminCatalogPageHeader";
import {
  type CourseStatus,
  useGetAdminCourseQuery,
  useUpdateCourseStatusMutation,
} from "@/features/catalog/catalogApi";
import ClassRosterTable from "@/features/enrollments/components/ClassRosterTable";
import ManualEnrollmentForm from "@/features/enrollments/components/ManualEnrollmentForm";
import { useGetCourseRosterQuery } from "@/features/enrollments/enrollmentsApi";
import CourseCurriculumManager from "@/features/sessions/components/admin/CourseCurriculumManager";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import { getApiErrorMessage } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

const transitions: Record<CourseStatus, CourseStatus[]> = {
  DRAFT: ["OPEN_ACTIVE", "CANCELLED"],
  OPEN_ACTIVE: ["CLOSED_ACTIVE", "CANCELLED"],
  CLOSED_ACTIVE: ["COMPLETED", "CANCELLED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

export default function CourseWorkspacePage() {
  const {
    service: serviceSlug,
    categoryId,
    courseId,
  } = useParams<{ service: string; categoryId: string; courseId: string }>();
  const user = useAppSelector(selectAuthUser);
  const canPublish = hasPermission(user, PERMISSIONS.CATALOG_PUBLISH);
  const [enrollDialog, setEnrollDialog] = useState(false);
  const { data: course, isLoading } = useGetAdminCourseQuery(courseId);
  const { data: roster, isLoading: rosterLoading } = useGetCourseRosterQuery({
    courseId,
    limit: 100,
  });
  const [updateStatus, statusState] = useUpdateCourseStatusMutation();

  if (isLoading)
    return (
      <p role="status" aria-live="polite" className="py-16 text-center">
        Loading course…
      </p>
    );
  if (
    !course ||
    course.categoryId !== categoryId ||
    course.category.service.slug !== serviceSlug
  )
    return (
      <p className="rounded-xl bg-destructive/10 p-6 text-destructive">
        Course not found in this category.
      </p>
    );
  const service = course.category.service;

  const coursesHref = `/admin/services/${service.slug}/categories/${categoryId}/courses`;
  const catalogLocked =
    course.category.status === "ARCHIVED" ||
    Boolean(course.courseGroup.archivedAt);
  const readOnly =
    ["COMPLETED", "CANCELLED", "ARCHIVED"].includes(course.status) ||
    catalogLocked;
  const move = async (status: CourseStatus) => {
    try {
      await updateStatus({
        id: course.id,
        status,
        expectedStatus: course.status,
      }).unwrap();
      toast.success(`Course moved to ${status.replace("_", " ")}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not change course status"));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <AdminCatalogBreadcrumbs
        crumbs={[
          { label: "Services", href: "/admin/services" },
          {
            label: service.title,
            href: `/admin/services/${service.slug}/categories`,
          },
          { label: course.category.title, href: coursesHref },
          { label: `${course.title} · ${course.intakeKey}` },
        ]}
      />
      <AdminCatalogPageHeader
        title={course.title}
        description={`${course.intakeKey} · ${course.code} · This one Course owns its curriculum, visibility, learners, and lifecycle.`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/sessions">
                <LibraryBig /> Manage session library
              </Link>
            </Button>
            {course.accessType === "PAID" && course.status === "OPEN_ACTIVE" ? (
              <Button onClick={() => setEnrollDialog(true)}>
                <Plus /> Enroll learners
              </Button>
            ) : null}
          </div>
        }
      />

      <section className="rounded-md border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Course lifecycle</h2>
            <p className="text-sm text-muted-foreground">
              Only Open-Active accepts enrollment and appears publicly.
              Closed-Active keeps teaching existing learners.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{course.status.replace("_", " ")}</Badge>
            {transitions[course.status].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={
                  status === "CANCELLED" || status === "ARCHIVED"
                    ? "destructive"
                    : "outline"
                }
                disabled={
                  (catalogLocked && status === "OPEN_ACTIVE") ||
                  statusState.isLoading ||
                  (["OPEN_ACTIVE", "CLOSED_ACTIVE", "ARCHIVED"].includes(
                    status,
                  ) &&
                    !canPublish)
                }
                onClick={() => move(status)}
              >
                Move to {status.replace("_", " ").toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Curriculum and delivery</h2>
          <p className="text-sm text-muted-foreground">
            Every attached row has its own order and learner visibility for this
            intake.
          </p>
        </div>
        <CourseCurriculumManager courseId={course.id} readOnly={readOnly} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Learner roster</h2>
          <p className="text-sm text-muted-foreground">
            Enrollments, payment evidence, completion, and certificate issuance
            belong directly to this Course.
          </p>
        </div>
        <ClassRosterTable
          entries={roster?.enrollments ?? []}
          isLoading={rosterLoading}
          deliveryMode={course.accessType === "FREE" ? "FREE" : "PAID"}
          certificateEnabled={course.certificateEnabled}
        />
      </section>

      <Dialog open={enrollDialog} onOpenChange={setEnrollDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Enroll paid learners</DialogTitle>
            <DialogDescription>
              Add verified students who paid for {course.code}. Capacity is
              enforced transactionally.
            </DialogDescription>
          </DialogHeader>
          <ManualEnrollmentForm
            courseId={course.id}
            onSuccess={() => setEnrollDialog(false)}
            onCancel={() => setEnrollDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
