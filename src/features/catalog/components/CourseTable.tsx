"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole } from "@/features/auth/authSelectors";
import { getApiErrorMessage } from "@/lib/api";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import {
  type AdminCategory,
  type AdminCourse,
  useArchiveCourseMutation,
  useDeleteCoursePermanentlyMutation,
  usePublishCourseMutation,
  useUnarchiveCourseMutation,
  useUnpublishCourseMutation,
} from "../catalogApi";
import type { LearningServiceSlug } from "../catalogTypes";
import { CatalogStatusBadge } from "./CatalogStatusBadge";
import { CourseForm } from "./CourseForm";
import { NavigableTableRow } from "./NavigableTableRow";

type DestructiveAction = {
  type: "archive" | "delete";
  course: AdminCourse;
};

const formatPrice = (course: AdminCourse) => {
  if (course.accessType === "FREE") return "Free";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: course.currency,
    maximumFractionDigits: 0,
  }).format(course.price);
};

export function CourseTable({
  courses,
  serviceSlug,
  category,
}: {
  courses: AdminCourse[];
  serviceSlug: LearningServiceSlug;
  category: AdminCategory;
}) {
  const role = useAppSelector(selectAuthRole);
  const canEdit = hasPermission(role, PERMISSIONS.CATALOG_EDIT_DRAFTS);
  const canPublish = hasPermission(role, PERMISSIONS.CATALOG_PUBLISH);
  const canDelete = hasPermission(
    role,
    PERMISSIONS.CATALOG_DELETE_PERMANENTLY,
  );
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null);
  const [destructiveAction, setDestructiveAction] =
    useState<DestructiveAction | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [publishCourse] = usePublishCourseMutation();
  const [unpublishCourse] = useUnpublishCourseMutation();
  const [archiveCourse, archiveState] = useArchiveCourseMutation();
  const [unarchiveCourse] = useUnarchiveCourseMutation();
  const [deleteCoursePermanently, deleteState] =
    useDeleteCoursePermanentlyMutation();
  const courseBase = `/admin/services/${serviceSlug}/categories/${category.id}/courses`;

  const lifecycle = async (
    course: AdminCourse,
    action: "publish" | "unpublish" | "unarchive",
  ) => {
    try {
      if (action === "publish") await publishCourse(course.id).unwrap();
      if (action === "unpublish") await unpublishCourse(course.id).unwrap();
      if (action === "unarchive") await unarchiveCourse(course.id).unwrap();
      toast.success(
        action === "unarchive"
          ? "Course restored as an unpublished draft"
          : `Course ${action}ed`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Action failed"));
    }
  };

  const confirmDestructiveAction = async () => {
    if (!destructiveAction) return;
    const { course, type } = destructiveAction;

    try {
      if (type === "archive") {
        await archiveCourse(course.id).unwrap();
        toast.success("Course archived");
      } else {
        await deleteCoursePermanently(course.id).unwrap();
        toast.success("Course and dependent records permanently deleted");
      }
      setDestructiveAction(null);
      setDeleteConfirmation("");
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          type === "archive" ? "Archive failed" : "Permanent deletion failed",
        ),
      );
    }
  };

  const requiredDeleteText = destructiveAction
    ? `DELETE ${destructiveAction.course.title}`
    : "";

  return (
    <>
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <tr>
              <TableHead className="px-4">Course</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <tr>
                <TableCell colSpan={7} className="h-36 text-center text-muted-foreground">
                  No courses have been created in this category yet.
                </TableCell>
              </tr>
            ) : (
              courses.map((course) => {
                const isArchived =
                  course.status === "ARCHIVED" ||
                  course.category.status === "ARCHIVED";
                const parentIsArchived =
                  course.category.status === "ARCHIVED";
                const sessionHref = `${courseBase}/${course.id}/sessions`;

                return (
                  <NavigableTableRow
                    key={course.id}
                    href={sessionHref}
                    label={`Open ${course.title} sessions`}
                  >
                    <TableCell className="max-w-sm whitespace-normal px-4 py-4">
                      <p className="font-semibold">{course.title}</p>
                      <p className="font-mono text-xs text-muted-foreground">/{course.slug}</p>
                    </TableCell>
                    <TableCell className="capitalize">{course.level.toLowerCase()}</TableCell>
                    <TableCell>
                      <p className="font-medium">{formatPrice(course)}</p>
                      <p className="text-xs text-muted-foreground">{course.accessType.toLowerCase()} access</p>
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">{course.sessionCount}</TableCell>
                    <TableCell>
                      {course.category.serviceType === "FREE_LEARNING" ? (
                        <>
                          <p className="font-mono font-medium tabular-nums">{course.enrollmentCount}</p>
                          <p className="text-xs text-muted-foreground">enrollments</p>
                        </>
                      ) : (
                        <>
                          <p className="font-mono font-medium tabular-nums">
                            {course.batchCount} / {course.enrollmentCount}
                          </p>
                          <p className="text-xs text-muted-foreground">batches / enrollments</p>
                        </>
                      )}
                    </TableCell>
                    <TableCell><CatalogStatusBadge status={course.status} /></TableCell>
                    <TableCell className="pr-4 text-right" data-no-row-navigation>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${course.title}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canEdit ? (
                            <DropdownMenuItem disabled={isArchived} onSelect={() => setSelectedCourse(course)}>
                              <Pencil /> Edit
                            </DropdownMenuItem>
                          ) : null}
                          {course.category.serviceType === "FREE_LEARNING" ? (
                            <DropdownMenuItem asChild>
                              <Link href={`${courseBase}/${course.id}/learners`}>
                                <UserRound /> Learners
                              </Link>
                            </DropdownMenuItem>
                          ) : null}
                          {canPublish && course.status === "ARCHIVED" ? (
                            <DropdownMenuItem
                              disabled={parentIsArchived}
                              onSelect={() => lifecycle(course, "unarchive")}
                            >
                              <ArchiveRestore /> Unarchive
                            </DropdownMenuItem>
                          ) : null}
                          {canPublish && !isArchived ? (
                            <DropdownMenuItem
                              onSelect={() =>
                                lifecycle(
                                  course,
                                  course.status === "PUBLISHED" ? "unpublish" : "publish",
                                )
                              }
                            >
                              {course.status === "PUBLISHED" ? <EyeOff /> : <Eye />}
                              {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                            </DropdownMenuItem>
                          ) : null}
                          {canPublish && !isArchived ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setDestructiveAction({ type: "archive", course })}
                              >
                                <Archive /> Archive
                              </DropdownMenuItem>
                            </>
                          ) : null}
                          {canDelete && course.status === "ARCHIVED" ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => {
                                  setDeleteConfirmation("");
                                  setDestructiveAction({ type: "delete", course });
                                }}
                              >
                                <Trash2 /> Delete permanently
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </NavigableTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selectedCourse)}
        onOpenChange={(open) => {
          if (!open) setSelectedCourse(null);
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit course</DialogTitle>
            <DialogDescription>
              Update {selectedCourse?.title}. Published course identity fields remain locked.
            </DialogDescription>
          </DialogHeader>
          {selectedCourse ? (
            <CourseForm
              key={selectedCourse.id}
              initial={selectedCourse}
              lockedCategory={category}
              embedded
              onSuccess={() => setSelectedCourse(null)}
              onCancel={() => setSelectedCourse(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(destructiveAction)}
        onOpenChange={(open) => {
          if (!open) {
            setDestructiveAction(null);
            setDeleteConfirmation("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {destructiveAction?.type === "delete"
                ? "Permanently delete course?"
                : "Archive course?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {destructiveAction?.type === "delete"
                ? `This permanently removes ${destructiveAction.course.title}, ${destructiveAction.course.batchCount} batch(es), ${destructiveAction.course.enrollmentCount} enrollment(s), curriculum relationships, progress, certificates, and projects. Reusable Session Library resources remain available.`
                : `This removes ${destructiveAction?.course.title} from active administration and the public catalog. Existing enrolled learners keep their learning access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {destructiveAction?.type === "delete" ? (
            <div className="space-y-2">
              <Label htmlFor="course-delete-confirmation">
                Type <span className="font-mono">{requiredDeleteText}</span> to confirm
              </Label>
              <Input
                id="course-delete-confirmation"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                autoComplete="off"
              />
            </div>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={
                archiveState.isLoading ||
                deleteState.isLoading ||
                (destructiveAction?.type === "delete" &&
                  deleteConfirmation !== requiredDeleteText)
              }
              onClick={confirmDestructiveAction}
            >
              {destructiveAction?.type === "delete" ? "Delete permanently" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
