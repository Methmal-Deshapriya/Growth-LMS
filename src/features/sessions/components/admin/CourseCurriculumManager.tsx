"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Link2,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getApiErrorMessage } from "@/lib/api";
import {
  useAttachCourseSessionMutation,
  useGetCourseCurriculumQuery,
  useGetSessionLibraryQuery,
  useRemoveCourseSessionMutation,
  useReorderCourseCurriculumMutation,
} from "../../sessionsApi";

export default function CourseCurriculumManager({
  courseId,
  readOnly = false,
}: {
  courseId: string;
  readOnly?: boolean;
}) {
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const { data, isLoading, isError } = useGetCourseCurriculumQuery({ courseId });
  const {
    data: library,
    isFetching: isLibraryFetching,
    isError: isLibraryError,
  } = useGetSessionLibraryQuery({
    status: "READY",
    attachableCourseId: courseId,
  }, { skip: readOnly });
  const [attach, attachState] = useAttachCourseSessionMutation();
  const [reorder, reorderState] = useReorderCourseCurriculumMutation();
  const [remove, removeState] = useRemoveCourseSessionMutation();
  const attachedIds = useMemo(
    () => new Set(data?.curriculum.map(({ session }) => session.id) ?? []),
    [data?.curriculum],
  );
  const attachable = useMemo(
    () => library?.sessions.filter(({ id }) => !attachedIds.has(id)) ?? [],
    [attachedIds, library?.sessions],
  );

  const attachSelected = async () => {
    if (!selectedSessionId) return;
    if (
      data?.delivery.immediateAvailability &&
      data.delivery.affectedLearnerCount > 0 &&
      !window.confirm(
        `This Free Learning course has ${data.delivery.affectedLearnerCount} learner(s). The session becomes available immediately and changes their progress denominator. Continue?`,
      )
    ) {
      return;
    }

    try {
      await attach({ courseId, sessionId: selectedSessionId }).unwrap();
      setSelectedSessionId("");
      toast.success("Session attached to the course curriculum");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not attach session"));
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!data) return;
    const target = index + direction;
    if (target < 0 || target >= data.curriculum.length) return;
    const ordered = [...data.curriculum];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];

    try {
      await reorder({
        courseId,
        courseSessions: ordered.map(({ id }, orderIndex) => ({ id, orderIndex })),
      }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not reorder curriculum"));
    }
  };

  const removeItem = async (courseSessionId: string, title: string) => {
    const message = data?.delivery.immediateAvailability
      ? `Retire "${title}"? It disappears from the current free classroom and progress denominator, while completion history remains.`
      : `Remove "${title}" from the master curriculum? Delivered batch history will be preserved.`;
    if (!window.confirm(message)) return;

    try {
      const result = await remove({ courseId, courseSessionId }).unwrap();
      toast.success(
        result.action === "RETIRED"
          ? "Curriculum session retired"
          : "Session detached",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update curriculum"));
    }
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        Loading curriculum…
      </p>
    );
  }
  if (isError || !data) {
    return (
      <p className="rounded-md bg-destructive/10 p-6 text-destructive">
        Could not load the curriculum.
      </p>
    );
  }

  const pickerPlaceholder = isLibraryFetching
    ? "Loading available sessions…"
    : isLibraryError
      ? "Could not load available sessions"
      : attachable.length === 0
        ? "No attachable sessions available"
        : "Choose a session resource";

  return (
    <div className="space-y-5">
      <div className="rounded-md border bg-card px-4 py-3">
        <p className="font-semibold">
          {data.delivery.deliveryMode === "COHORT"
            ? "Cohort master curriculum"
            : "Live Free Learning curriculum"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.delivery.immediateAvailability
            ? `Active attachments are immediately visible to ${data.delivery.affectedLearnerCount} enrolled learner(s).`
            : "Attachments define the reusable master order; each paid batch controls its own releases."}
        </p>
      </div>

      {readOnly ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          Archived courses retain delivery history but cannot change curriculum.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-md border bg-card">
        {!readOnly ? (
          <div className="flex flex-col gap-3 border-b bg-muted/15 p-4 md:flex-row md:items-end">
            <label className="min-w-0 flex-1 space-y-2 text-sm font-medium">
              Attach a session
              <select
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedSessionId}
                disabled={isLibraryFetching || isLibraryError || attachable.length === 0}
                onChange={(event) => setSelectedSessionId(event.target.value)}
              >
                <option value="">{pickerPlaceholder}</option>
                {attachable.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title} · {session.reusePolicy === "REUSABLE" ? "Reusable" : "One course"}
                  </option>
                ))}
              </select>
            </label>
            <Button
              disabled={!selectedSessionId || attachState.isLoading}
              onClick={attachSelected}
            >
              {attachState.isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Link2 />
              )}
              Attach session
            </Button>
          </div>
        ) : null}

        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-20 px-4">Order</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Reuse</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.curriculum.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-36 whitespace-normal text-center text-muted-foreground"
                >
                  No sessions are attached to this course yet. Choose an available
                  Session Library resource above.
                </TableCell>
              </TableRow>
            ) : (
              data.curriculum.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 font-mono font-medium tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal py-4">
                    <p className="font-semibold">{item.session.title}</p>
                    {item.session.description ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {item.session.description}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.session.reusePolicy === "REUSABLE"
                        ? "Reusable"
                        : "One course"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {item.session.durationMinutes
                      ? `${item.session.durationMinutes} min`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <p className="font-mono font-medium tabular-nums">
                      {item.usage.batchCount} / {item.usage.completionCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      batches / completions
                    </p>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    {readOnly ? (
                      <span className="text-xs text-muted-foreground">Read only</span>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${item.session.title}`}
                            disabled={reorderState.isLoading || removeState.isLoading}
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={index === 0}
                            onSelect={() => move(index, -1)}
                          >
                            <ArrowUp /> Move up
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={index === data.curriculum.length - 1}
                            onSelect={() => move(index, 1)}
                          >
                            <ArrowDown /> Move down
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => removeItem(item.id, item.session.title)}
                          >
                            <Trash2 /> Remove from course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
