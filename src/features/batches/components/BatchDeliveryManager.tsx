"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SequenceRiskConfirmationDialog } from "@/components/admin/SequenceRiskConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}: {
  batchId: string;
  courseId: string;
  batchStatus: string;
}) {
  const { data, isLoading, isError } = useGetBatchSessionsQuery(batchId);
  const [updateDelivery, updateState] = useUpdateBatchSessionDeliveryMutation();
  const [pendingRisk, setPendingRisk] = useState<{
    input: DeliveryInput;
    message: string;
    details?: unknown;
  } | null>(null);

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

  const schedule = (courseSessionId: string) => {
    const local = window.prompt(
      "Release date/time (for example 2026-08-08T18:00)",
    );
    if (!local) return;
    const date = new Date(local);
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      toast.error("Choose a valid future date and time");
      return;
    }
    void submitDelivery({
      batchId,
      courseSessionId,
      mode: "SCHEDULED",
      availableAt: date.toISOString(),
    });
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
                      ? new Date(item.availableAt).toLocaleString()
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
                          onClick={() => schedule(item.courseSessionId)}
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
    </section>
  );
}
