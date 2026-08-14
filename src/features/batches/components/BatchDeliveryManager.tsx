"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SequenceRiskConfirmationDialog } from "@/components/admin/SequenceRiskConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getApiErrorMessage,
  isNormalizedApiError,
} from "@/lib/api";
import {
  useGetBatchSessionsQuery,
  useUpdateBatchSessionDeliveryMutation,
} from "../batchesApi";

type DeliveryInput = {
  batchId: string;
  courseSessionId: string;
  mode: "UNRELEASED" | "RELEASED" | "SCHEDULED";
  availableAt?: string | null;
  acknowledgeSequenceRisk?: boolean;
};

const stateStyles = {
  UNRELEASED: "border-muted-foreground/20 bg-muted text-muted-foreground",
  WITHDRAWN: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  SCHEDULED: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  RELEASED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
} as const;

export default function BatchDeliveryManager({
  batchId,
  batchStatus,
  timezone,
}: {
  batchId: string;
  batchStatus: string;
  timezone: string;
}) {
  const { data, isLoading, isError } = useGetBatchSessionsQuery(batchId);
  const [updateDelivery, updateState] = useUpdateBatchSessionDeliveryMutation();
  const [pendingRisk, setPendingRisk] = useState<{
    input: DeliveryInput;
    message: string;
    details?: unknown;
  } | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<{
    courseSessionId: string;
    title: string;
  } | null>(null);
  const [scheduleValue, setScheduleValue] = useState("");

  const submitDelivery = async (
    input: DeliveryInput,
    acknowledgeSequenceRisk = false,
  ) => {
    try {
      await updateDelivery({ ...input, acknowledgeSequenceRisk }).unwrap();
      setPendingRisk(null);
      toast.success(
        input.mode === "RELEASED"
          ? "Session released"
          : input.mode === "SCHEDULED"
            ? "Session scheduled"
            : "Session withdrawn",
      );
    } catch (error) {
      if (
        isNormalizedApiError(error) &&
        error.code === "SEQUENCE_RISK_CONFIRMATION_REQUIRED" &&
        !acknowledgeSequenceRisk
      ) {
        setPendingRisk({ input, message: error.message, details: error.details });
        return;
      }
      toast.error(getApiErrorMessage(error, "Could not update delivery"));
    }
  };

  const schedule = () => {
    if (!scheduleTarget || !scheduleValue) return;
    const date = zonedDateTimeToDate(scheduleValue, timezone);
    if (!date || date <= new Date()) {
      toast.error("Choose a valid future date and time");
      return;
    }
    void submitDelivery({
      batchId,
      courseSessionId: scheduleTarget.courseSessionId,
      mode: "SCHEDULED",
      availableAt: date.toISOString(),
    });
    setScheduleTarget(null);
    setScheduleValue("");
  };

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="py-12 text-center text-muted-foreground"
      >
        <Loader2 className="mx-auto size-5 animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading batch delivery…</span>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <p
        role="alert"
        className="rounded-md bg-destructive/10 p-6 text-destructive"
      >
        Could not load batch delivery.
      </p>
    );
  }

  const canDeliver = batchStatus === "ACTIVE";

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Batch delivery</h2>
        <p className="text-sm text-muted-foreground">
          Membership and order follow the course curriculum automatically. This
          page controls only this batch&apos;s release state.
        </p>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableCaption className="sr-only">
            Session delivery status for this batch
          </TableCaption>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-20 px-4">Order</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Completions</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.sessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 whitespace-normal text-center text-muted-foreground"
                >
                  This course has no sessions yet. Attach them from the course
                  curriculum page.
                </TableCell>
              </TableRow>
            ) : (
              data.sessions.map((item, index) => (
                <TableRow key={item.courseSessionId}>
                  <TableCell className="px-4 font-mono font-medium tabular-nums">
                    {String((item.orderIndex ?? index) + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal py-4">
                    <p className="font-semibold">
                      {item.courseSession.session.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.source === "RETAINED_HISTORY"
                        ? "Retired course session retained for delivery history"
                        : item.inherited
                          ? "Inherited from course curriculum"
                          : "Batch delivery override"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={stateStyles[item.state]}>
                      {item.state.charAt(0) + item.state.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.availableAt
                      ? new Date(item.availableAt).toLocaleString(undefined, {
                          timeZone: timezone,
                          timeZoneName: "short",
                        })
                      : item.state === "RELEASED"
                        ? "Available now"
                        : "Not learner-visible"}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {item.completionCount}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    {canDeliver ? (
                      <div className="flex justify-end gap-2">
                        {item.isReleased ? (
                          <Button
                            size="sm"
                            variant="outline"
                            aria-label={`Withdraw ${item.courseSession.session.title}`}
                            disabled={updateState.isLoading}
                            onClick={() =>
                              void submitDelivery({
                                batchId,
                                courseSessionId: item.courseSessionId,
                                mode: "UNRELEASED",
                              })
                            }
                          >
                            <EyeOff aria-hidden="true" /> Withdraw
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            aria-label={`Release ${item.courseSession.session.title} now`}
                            disabled={updateState.isLoading}
                            onClick={() =>
                              void submitDelivery({
                                batchId,
                                courseSessionId: item.courseSessionId,
                                mode: "RELEASED",
                              })
                            }
                          >
                            <Eye aria-hidden="true" /> Release now
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          aria-label={`Schedule ${item.courseSession.session.title}`}
                          disabled={updateState.isLoading}
                          onClick={() =>
                            setScheduleTarget({
                              courseSessionId: item.courseSessionId,
                              title: item.courseSession.session.title,
                            })
                          }
                        >
                          Schedule
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {batchStatus === "DRAFT" || batchStatus === "ENROLLING"
                          ? "Activate batch to release"
                          : "Read only"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SequenceRiskConfirmationDialog
        open={Boolean(pendingRisk)}
        description={pendingRisk?.message ?? ""}
        details={pendingRisk?.details}
        isLoading={updateState.isLoading}
        onOpenChange={(open) => {
          if (!open) setPendingRisk(null);
        }}
        onConfirm={() => {
          if (pendingRisk) void submitDelivery(pendingRisk.input, true);
        }}
      />
      <Dialog
        open={Boolean(scheduleTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setScheduleTarget(null);
            setScheduleValue("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule session release</DialogTitle>
            <DialogDescription>
              Choose when {scheduleTarget?.title} becomes available. The value
              is interpreted in the batch timezone: {timezone}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="batch-session-release-at">Release date and time</Label>
            <Input
              id="batch-session-release-at"
              type="datetime-local"
              value={scheduleValue}
              onChange={(event) => setScheduleValue(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setScheduleTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!scheduleValue || updateState.isLoading}
              onClick={schedule}
            >
              Schedule release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function zonedDateTimeToDate(value: string, timeZone: string): Date | null {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (!match) return null;
  const [, year, month, day, hour, minute, second = "0"] = match;
  const requestedUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  const offsetAt = (instant: number) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(instant));
    const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
    const representedUtc = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second),
    );
    return representedUtc - instant;
  };

  try {
    let instant = requestedUtc - offsetAt(requestedUtc);
    instant = requestedUtc - offsetAt(instant);
    const date = new Date(instant);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}
