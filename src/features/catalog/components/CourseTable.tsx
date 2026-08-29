"use client";

import { Fragment, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import { getApiErrorMessage } from "@/lib/api";
import type { LearningServiceSlug } from "../catalogTypes";
import {
  type AdminCategory,
  type AdminCourse,
  type AdminCourseGroup,
  type CourseStatus,
  useArchiveCourseGroupMutation,
  useDeleteCourseGroupMutation,
  useDeleteCoursePermanentlyMutation,
  useUnarchiveCourseGroupMutation,
  useUpdateCourseStatusMutation,
} from "../catalogApi";
import { CourseForm } from "./CourseForm";

const transitions: Record<CourseStatus, CourseStatus[]> = {
  DRAFT: ["OPEN_ACTIVE", "CANCELLED"],
  OPEN_ACTIVE: ["CLOSED_ACTIVE", "CANCELLED"],
  CLOSED_ACTIVE: ["COMPLETED", "CANCELLED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

const statusClass: Record<CourseStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  OPEN_ACTIVE: "bg-emerald-500/10 text-emerald-700",
  CLOSED_ACTIVE: "bg-blue-500/10 text-blue-700",
  COMPLETED: "bg-violet-500/10 text-violet-700",
  CANCELLED: "bg-red-500/10 text-red-700",
  ARCHIVED: "bg-zinc-500/10 text-zinc-600",
};

function statusLabel(status: CourseStatus) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function CourseTable({
  groups,
  serviceSlug,
  category,
}: {
  groups: AdminCourseGroup[];
  serviceSlug: LearningServiceSlug;
  category: AdminCategory;
}) {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const canPublish = hasPermission(user, PERMISSIONS.CATALOG_PUBLISH);
  const canDelete = hasPermission(user, PERMISSIONS.CATALOG_DELETE_PERMANENTLY);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(groups.map(({ id }) => id)),
  );
  const [courseDialog, setCourseDialog] = useState<{
    group: AdminCourseGroup;
    course?: AdminCourse;
  } | null>(null);
  const [updateStatus, statusState] = useUpdateCourseStatusMutation();
  const [archiveGroup] = useArchiveCourseGroupMutation();
  const [unarchiveGroup] = useUnarchiveCourseGroupMutation();
  const [deleteGroup] = useDeleteCourseGroupMutation();
  const [deleteCourse] = useDeleteCoursePermanentlyMutation();
  const base = `/admin/services/${serviceSlug}/categories/${category.id}/courses`;

  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const move = async (course: AdminCourse, status: CourseStatus) => {
    try {
      await updateStatus({
        id: course.id,
        status,
        expectedStatus: course.status,
      }).unwrap();
      toast.success(`${course.code} moved to ${statusLabel(status)}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not change course status"));
    }
  };

  const groupLifecycle = async (group: AdminCourseGroup) => {
    try {
      if (group.archivedAt) await unarchiveGroup(group.id).unwrap();
      else await archiveGroup(group.id).unwrap();
      toast.success(
        group.archivedAt ? "Course group restored" : "Course group archived",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not change course group"));
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-4">Course / intake</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Curriculum</TableHead>
              <TableHead>Learners</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-36 text-center text-muted-foreground"
                >
                  No real-world courses have been created in this category.
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => {
                const isExpanded = expanded.has(group.id);
                const groupReadOnly =
                  Boolean(group.archivedAt) || category.status === "ARCHIVED";
                return (
                  <Fragment key={group.id}>
                    <TableRow
                      className={isExpanded ? "bg-primary/10" : "bg-muted/20"}
                    >
                      <TableCell className="px-4 py-4" colSpan={6}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 text-left"
                          onClick={() => toggle(group.id)}
                          aria-expanded={isExpanded}
                        >
                          <ChevronRight
                            className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                          <span>
                            <span className="block font-semibold">
                              {group.title}
                            </span>
                            <span className="block font-mono text-xs text-muted-foreground">
                              /{group.slug} · {group.batchCodePrefix} ·{" "}
                              {group.courseCount} course record(s)
                            </span>
                          </span>
                        </button>
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${group.title}`}
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={
                                Boolean(group.archivedAt) ||
                                (category.service.courseMode === "EVERGREEN" &&
                                  group.courses.length > 0)
                              }
                              onSelect={() => setCourseDialog({ group })}
                            >
                              <Plus />{" "}
                              {group.courses.length
                                ? "New intake"
                                : "Create first course"}
                            </DropdownMenuItem>
                            {canPublish ? (
                              <DropdownMenuItem
                                onSelect={() => groupLifecycle(group)}
                              >
                                {group.archivedAt ? (
                                  <ArchiveRestore />
                                ) : (
                                  <Archive />
                                )}{" "}
                                {group.archivedAt
                                  ? "Restore group"
                                  : "Archive group"}
                              </DropdownMenuItem>
                            ) : null}
                            {canDelete &&
                            group.archivedAt &&
                            group.courses.length === 0 ? (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={() =>
                                    deleteGroup(group.id)
                                      .unwrap()
                                      .then(() =>
                                        toast.success("Course group deleted"),
                                      )
                                      .catch((error) =>
                                        toast.error(
                                          getApiErrorMessage(
                                            error,
                                            "Could not delete group",
                                          ),
                                        ),
                                      )
                                  }
                                >
                                  <Trash2 /> Delete group
                                </DropdownMenuItem>
                              </>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {isExpanded && group.courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-20 text-center">
                          <Button
                            variant="link"
                            disabled={Boolean(group.archivedAt)}
                            onClick={() => setCourseDialog({ group })}
                          >
                            + Create the first course record
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {isExpanded
                      ? group.courses.map((course) => (
                          <TableRow
                            key={course.id}
                            className="cursor-pointer hover:bg-muted/50"
                            tabIndex={0}
                            onClick={() =>
                              router.push(`${base}/${course.id}/sessions`)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter")
                                router.push(`${base}/${course.id}/sessions`);
                            }}
                          >
                            <TableCell className="pl-12 py-4">
                              <p className="font-semibold">{course.title}</p>
                              <p className="font-mono text-xs text-muted-foreground">
                                {course.intakeKey} · {course.code}
                              </p>
                            </TableCell>
                            <TableCell className="text-xs">
                              {course.instanceKind === "EVERGREEN" ? (
                                "Evergreen"
                              ) : (
                                <>
                                  {course.startDate
                                    ? new Date(
                                        course.startDate,
                                      ).toLocaleDateString()
                                    : "—"}
                                  <br />
                                  {course.expectedEndDate
                                    ? new Date(
                                        course.expectedEndDate,
                                      ).toLocaleDateString()
                                    : "—"}
                                </>
                              )}
                            </TableCell>
                            <TableCell className="font-mono">
                              {course.sessionCount}
                            </TableCell>
                            <TableCell className="font-mono">
                              {course.enrollmentCount}
                              {course.capacity ? ` / ${course.capacity}` : ""}
                            </TableCell>
                            <TableCell>
                              {course.accessType === "FREE"
                                ? "Free"
                                : new Intl.NumberFormat("en-LK", {
                                    style: "currency",
                                    currency: "LKR",
                                    maximumFractionDigits: 0,
                                  }).format(course.price)}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusClass[course.status]}>
                                {statusLabel(course.status)}
                              </Badge>
                            </TableCell>
                            <TableCell
                              className="pr-4 text-right"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Actions for ${course.code}`}
                                  >
                                    <MoreHorizontal />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    disabled={
                                      groupReadOnly ||
                                      [
                                        "COMPLETED",
                                        "CANCELLED",
                                        "ARCHIVED",
                                      ].includes(course.status)
                                    }
                                    onSelect={() =>
                                      setCourseDialog({ group, course })
                                    }
                                  >
                                    <Pencil /> Edit intake setup
                                  </DropdownMenuItem>
                                  {transitions[course.status].map((target) => (
                                    <DropdownMenuItem
                                      key={target}
                                      disabled={
                                        (groupReadOnly &&
                                          target === "OPEN_ACTIVE") ||
                                        statusState.isLoading ||
                                        ([
                                          "OPEN_ACTIVE",
                                          "CLOSED_ACTIVE",
                                          "ARCHIVED",
                                        ].includes(target) &&
                                          !canPublish)
                                      }
                                      onSelect={() => move(course, target)}
                                    >
                                      {statusLabel(target)}
                                    </DropdownMenuItem>
                                  ))}
                                  {canDelete &&
                                  course.status === "ARCHIVED" &&
                                  course.sessionCount === 0 &&
                                  course.enrollmentCount === 0 &&
                                  course.projectCount === 0 ? (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onSelect={() =>
                                          deleteCourse(course.id)
                                            .unwrap()
                                            .then(() =>
                                              toast.success("Course deleted"),
                                            )
                                            .catch((error) =>
                                              toast.error(
                                                getApiErrorMessage(
                                                  error,
                                                  "Could not delete course",
                                                ),
                                              ),
                                            )
                                        }
                                      >
                                        <Trash2 /> Delete permanently
                                      </DropdownMenuItem>
                                    </>
                                  ) : null}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(courseDialog)}
        onOpenChange={(open) => {
          if (!open) setCourseDialog(null);
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {courseDialog?.course
                ? "Edit course intake"
                : courseDialog?.group.courses.length
                  ? "Create a new intake"
                  : "Create the first course"}
            </DialogTitle>
            <DialogDescription>
              CourseGroup stays internal; this Course record owns curriculum,
              visibility, learners, and lifecycle.
            </DialogDescription>
          </DialogHeader>
          {courseDialog ? (
            <CourseForm
              group={courseDialog.group}
              initial={courseDialog.course}
              onSuccess={() => setCourseDialog(null)}
              onCancel={() => setCourseDialog(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
