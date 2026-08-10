"use client";

import { Fragment, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Link2,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SequenceRiskConfirmationDialog } from "@/components/admin/SequenceRiskConfirmationDialog";
import { BatchStatusBadge } from "@/features/batches/components/BatchStatusBadge";
import { NavigableTableRow } from "@/features/catalog/components/NavigableTableRow";
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
import { getApiErrorMessage, isNormalizedApiError } from "@/lib/api";
import {
  useAttachCourseSessionMutation,
  useGetCourseCurriculumQuery,
  useGetSessionLibraryQuery,
  useRemoveCourseSessionMutation,
  useReorderCourseCurriculumMutation,
} from "../../sessionsApi";

const retiredDateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

function batchDeliveryLabel({
  isReleased,
  availableAt,
}: {
  isReleased: boolean;
  availableAt: string | null;
}) {
  if (!isReleased) return "Withdrawn";
  if (availableAt && new Date(availableAt) > new Date()) return "Scheduled";
  return "Released";
}

export default function CourseCurriculumManager({
  courseId,
  serviceSlug,
  categoryId,
  readOnly = false,
}: {
  courseId: string;
  serviceSlug: string;
  categoryId: string;
  readOnly?: boolean;
}) {
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [expandedRetiredIds, setExpandedRetiredIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [reattachingId, setReattachingId] = useState<string | null>(null);
  const [pendingReorder, setPendingReorder] = useState<{
    courseSessions: { id: string; orderIndex: number }[];
    message: string;
    details?: unknown;
  } | null>(null);
  const { data, isLoading, isError } = useGetCourseCurriculumQuery({
    courseId,
    includeRetired: true,
  });
  const {
    data: library,
    isFetching: isLibraryFetching,
    isError: isLibraryError,
  } = useGetSessionLibraryQuery(
    {
      status: "READY",
      attachableCourseId: courseId,
    },
    { skip: readOnly },
  );
  const [attach, attachState] = useAttachCourseSessionMutation();
  const [reorder, reorderState] = useReorderCourseCurriculumMutation();
  const [remove, removeState] = useRemoveCourseSessionMutation();
  const activeCurriculum = useMemo(
    () => data?.curriculum.filter(({ retiredAt }) => !retiredAt) ?? [],
    [data?.curriculum],
  );
  const retiredCurriculum = useMemo(
    () => data?.curriculum.filter(({ retiredAt }) => Boolean(retiredAt)) ?? [],
    [data?.curriculum],
  );
  const relatedSessionIds = useMemo(
    () => new Set(data?.curriculum.map(({ session }) => session.id) ?? []),
    [data?.curriculum],
  );
  const attachable = useMemo(
    () => library?.sessions.filter(({ id }) => !relatedSessionIds.has(id)) ?? [],
    [library?.sessions, relatedSessionIds],
  );

  const confirmImmediateAttachment = () =>
    !(
      data?.delivery.immediateAvailability &&
      data.delivery.affectedLearnerCount > 0
    ) ||
    window.confirm(
      `This Free Learning course has ${data.delivery.affectedLearnerCount} learner(s). The session becomes available immediately and changes their progress denominator. Continue?`,
    );

  const attachSelected = async () => {
    if (!selectedSessionId) return;
    if (!confirmImmediateAttachment()) return;

    try {
      await attach({ courseId, sessionId: selectedSessionId }).unwrap();
      setSelectedSessionId("");
      toast.success("Session attached to the course curriculum");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not attach session"));
    }
  };

  const reattachRetired = async (sessionId: string) => {
    if (!confirmImmediateAttachment()) return;
    setReattachingId(sessionId);
    try {
      await attach({ courseId, sessionId }).unwrap();
      toast.success("Session reattached to the course curriculum");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not reattach session"));
    } finally {
      setReattachingId(null);
    }
  };

  const toggleRetiredBatches = (courseSessionId: string) => {
    setExpandedRetiredIds((current) => {
      const next = new Set(current);
      if (next.has(courseSessionId)) next.delete(courseSessionId);
      else next.add(courseSessionId);
      return next;
    });
  };

  const submitReorder = async (
    courseSessions: { id: string; orderIndex: number }[],
    acknowledgeSequenceRisk = false,
  ) => {
    try {
      await reorder({
        courseId,
        courseSessions,
        acknowledgeSequenceRisk,
      }).unwrap();
      setPendingReorder(null);
      toast.success("Course curriculum reordered");
    } catch (error) {
      if (
        isNormalizedApiError(error) &&
        error.code === "SEQUENCE_RISK_CONFIRMATION_REQUIRED" &&
        !acknowledgeSequenceRisk
      ) {
        setPendingReorder({
          courseSessions,
          message: error.message,
          details: error.details,
        });
        return;
      }
      toast.error(getApiErrorMessage(error, "Could not reorder curriculum"));
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    if (!data) return;
    const target = index + direction;
    if (target < 0 || target >= activeCurriculum.length) return;
    const ordered = [...activeCurriculum];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    void submitReorder(
      ordered.map(({ id }, orderIndex) => ({ id, orderIndex })),
    );
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
            {activeCurriculum.length === 0 ? (
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
              activeCurriculum.map((item, index) => (
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
                            disabled={index === activeCurriculum.length - 1}
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

      {retiredCurriculum.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-tight">
              Retired sessions
            </h2>
            <p className="text-sm text-muted-foreground">
              Removed from the master curriculum but retained because existing
              batches or learner history still reference them.
            </p>
          </div>

          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="px-4">Session</TableHead>
                  <TableHead>Retired / delivery</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead>Completions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retiredCurriculum.map((item) => {
                  const hasBatches = item.usage.batches.length > 0;
                  const isExpanded = expandedRetiredIds.has(item.id);
                  const batchBase = `/admin/services/${serviceSlug}/categories/${categoryId}/courses/${courseId}/batches`;

                  return (
                    <Fragment key={item.id}>
                      <TableRow
                        className={
                          isExpanded
                            ? "border-primary/40 bg-primary/15 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/25 [&>td:first-child]:shadow-[inset_4px_0_0_var(--color-primary)]"
                            : "bg-muted/15"
                        }
                      >
                        <TableCell className="max-w-sm whitespace-normal px-4 py-4">
                          <div className="flex items-start gap-2">
                            {hasBatches ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="mt-0.5 shrink-0"
                                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.session.title} batch assignments`}
                                aria-expanded={isExpanded}
                                onClick={() => toggleRetiredBatches(item.id)}
                              >
                                <ChevronRight
                                  className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                />
                              </Button>
                            ) : (
                              <span className="w-6 shrink-0" aria-hidden="true" />
                            )}
                            <div>
                              <p className="font-semibold">{item.session.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.session.reusePolicy === "REUSABLE"
                                  ? "Reusable resource"
                                  : "One-course resource"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs tabular-nums">
                          {item.retiredAt
                            ? retiredDateFormatter.format(new Date(item.retiredAt))
                            : "—"}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {item.usage.batchCount}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {item.usage.completionCount}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          >
                            Retired
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-4 text-right" data-no-row-navigation>
                          {readOnly ? (
                            <span className="text-xs text-muted-foreground">
                              Read only
                            </span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Actions for retired session ${item.session.title}`}
                                  disabled={attachState.isLoading}
                                >
                                  {reattachingId === item.session.id ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    <MoreHorizontal />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onSelect={() => reattachRetired(item.session.id)}
                                >
                                  <RotateCcw /> Reattach to course
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>

                      {hasBatches && isExpanded
                        ? item.usage.batches.map((batch) => (
                            <NavigableTableRow
                              key={batch.batchSessionId}
                              href={`${batchBase}/${batch.batchId}`}
                              label={`Open ${batch.batchName} batch`}
                              className="bg-muted/20 hover:bg-muted/35"
                            >
                              <TableCell className="whitespace-normal py-3 pl-14">
                                <p className="font-medium">{batch.batchName}</p>
                                <p className="font-mono text-xs text-muted-foreground">
                                  {batch.batchCode}
                                </p>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {batchDeliveryLabel(batch)}
                              </TableCell>
                              <TableCell>—</TableCell>
                              <TableCell>—</TableCell>
                              <TableCell>
                                <BatchStatusBadge status={batch.batchStatus} />
                              </TableCell>
                              <TableCell className="pr-4 text-right text-xs text-muted-foreground">
                                Open batch
                              </TableCell>
                            </NavigableTableRow>
                          ))
                        : null}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}

      <SequenceRiskConfirmationDialog
        open={Boolean(pendingReorder)}
        description={pendingReorder?.message ?? ""}
        details={pendingReorder?.details}
        isLoading={reorderState.isLoading}
        onOpenChange={(open) => {
          if (!open) setPendingReorder(null);
        }}
        onConfirm={() => {
          if (pendingReorder) {
            void submitReorder(pendingReorder.courseSessions, true);
          }
        }}
      />
    </div>
  );
}
