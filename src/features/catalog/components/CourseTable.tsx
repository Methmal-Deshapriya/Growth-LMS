"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole } from "@/features/auth/authSelectors";
import { getApiErrorMessage } from "@/lib/api";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import {
  type AdminCourse,
  useArchiveCourseMutation,
  useDeleteCoursePermanentlyMutation,
  usePublishCourseMutation,
  useUnarchiveCourseMutation,
  useUnpublishCourseMutation,
} from "../catalogApi";

export function CourseTable({ courses }: { courses: AdminCourse[] }) {
  const role = useAppSelector(selectAuthRole);
  const canPublish = hasPermission(role, PERMISSIONS.CATALOG_PUBLISH);
  const canDelete = hasPermission(
    role,
    PERMISSIONS.CATALOG_DELETE_PERMANENTLY,
  );
  const [publishCourse] = usePublishCourseMutation();
  const [unpublishCourse] = useUnpublishCourseMutation();
  const [archiveCourse] = useArchiveCourseMutation();
  const [unarchiveCourse] = useUnarchiveCourseMutation();
  const [deleteCoursePermanently] = useDeleteCoursePermanentlyMutation();

  const lifecycle = async (
    course: AdminCourse,
    action: "publish" | "unpublish" | "archive" | "unarchive",
  ) => {
    if (action === "archive" && !confirm(`Archive ${course.title}?`)) return;
    try {
      if (action === "publish") await publishCourse(course.id).unwrap();
      if (action === "unpublish") await unpublishCourse(course.id).unwrap();
      if (action === "archive") await archiveCourse(course.id).unwrap();
      if (action === "unarchive") await unarchiveCourse(course.id).unwrap();
      toast.success(
        action === "unarchive"
          ? "Course restored as a draft"
          : `Course ${action}d`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Action failed"));
    }
  };

  const permanentlyDelete = async (course: AdminCourse) => {
    const confirmation = `DELETE ${course.title}`;
    const entered = window.prompt(
      `This permanently deletes the course relationships, ${course.batchCount} batch(es), ${course.enrollmentCount} enrollment(s), progress, certificates, and projects. Exclusive one-course resources may be deleted; reusable Session Library resources are preserved. This cannot be undone.\n\nType "${confirmation}" to continue.`,
    );
    if (entered === null) return;
    if (entered !== confirmation) {
      toast.error("Confirmation text did not match. Nothing was deleted.");
      return;
    }

    try {
      await deleteCoursePermanently(course.id).unwrap();
      toast.success("Course and all dependent records permanently deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Permanent deletion failed"));
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Course</th>
              <th className="p-4">Category</th>
              <th className="p-4">Access</th>
              <th className="p-4">Sessions</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => {
              const isArchived =
                course.status === "ARCHIVED" ||
                course.category.status === "ARCHIVED";
              const parentIsArchived = course.category.status === "ARCHIVED";

              return (
                <tr key={course.id}>
                  <td className="p-4">
                    <p className="font-semibold">{course.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      /{course.slug}
                    </p>
                  </td>
                  <td className="p-4">{course.category.title}</td>
                  <td className="p-4">
                    {course.accessType === "FREE"
                      ? "Free"
                      : `${course.currency} ${course.price.toLocaleString()}`}
                  </td>
                  <td className="p-4">{course.sessionCount}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/catalog/courses/${course.id}/sessions`}>
                          Curriculum
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>{course.category.serviceType === "FREE_LEARNING" ? <Link href={`/admin/catalog/courses/${course.id}/students`}>Learners</Link> : <Link href={`/admin/catalog/courses/${course.id}/batches`}>Batches</Link>}</Button>
                      {!isArchived ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/catalog/courses/${course.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      ) : null}
                      {canPublish && course.status === "ARCHIVED" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={parentIsArchived}
                          title={
                            parentIsArchived
                              ? "Unarchive the parent category first"
                              : "Restore this course as a draft"
                          }
                          onClick={() => lifecycle(course, "unarchive")}
                        >
                          Unarchive
                        </Button>
                      ) : null}
                      {canPublish && !isArchived ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            lifecycle(
                              course,
                              course.status === "PUBLISHED"
                                ? "unpublish"
                                : "publish",
                            )
                          }
                        >
                          {course.status === "PUBLISHED"
                            ? "Unpublish"
                            : "Publish"}
                        </Button>
                      ) : null}
                      {canDelete && course.status === "ARCHIVED" ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => permanentlyDelete(course)}
                        >
                          Delete permanently
                        </Button>
                      ) : null}
                      {canPublish && !isArchived ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => lifecycle(course, "archive")}
                        >
                          Archive
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
