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
  usePublishCourseMutation,
  useUnpublishCourseMutation,
} from "../catalogApi";

export function CourseTable({ courses }: { courses: AdminCourse[] }) {
  const role = useAppSelector(selectAuthRole);
  const canPublish = hasPermission(role, PERMISSIONS.CATALOG_PUBLISH);
  const [publishCourse] = usePublishCourseMutation();
  const [unpublishCourse] = useUnpublishCourseMutation();
  const [archiveCourse] = useArchiveCourseMutation();

  const lifecycle = async (
    course: AdminCourse,
    action: "publish" | "unpublish" | "archive",
  ) => {
    if (action === "archive" && !confirm(`Archive ${course.title}?`)) return;
    try {
      if (action === "publish") await publishCourse(course.id).unwrap();
      if (action === "unpublish") await unpublishCourse(course.id).unwrap();
      if (action === "archive") await archiveCourse(course.id).unwrap();
      toast.success(`Course ${action}d`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Action failed"));
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
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/catalog/courses/${course.id}/sessions`}>
                          Sessions
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/catalog/courses/${course.id}/students`}>
                          Students
                        </Link>
                      </Button>
                      {!isArchived ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/catalog/courses/${course.id}/edit`}>
                            Edit
                          </Link>
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
