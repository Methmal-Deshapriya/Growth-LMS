"use client";

import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApiErrorMessage } from "@/lib/api";
import { useUpdateBatchStatusMutation } from "../batchesApi";
import type { Batch, BatchStatus } from "../batchesTypes";
import { BatchStatusBadge } from "./BatchStatusBadge";

const transitions: Record<BatchStatus, BatchStatus[]> = {
  DRAFT: ["ENROLLING", "CANCELLED", "ARCHIVED"],
  ENROLLING: ["DRAFT", "ACTIVE", "CANCELLED", "ARCHIVED"],
  ACTIVE: ["COMPLETED", "CANCELLED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

export function BatchLifecycleControls({ batch }: { batch: Batch }) {
  const [updateStatus, updateState] = useUpdateBatchStatusMutation();

  const moveTo = async (status: BatchStatus) => {
    const detail =
      status === "COMPLETED"
        ? batch.course.certificateEnabled
          ? "Completion requires every current session to be released and available, every enrollment to be completed, and an issued certificate for every non-cancelled learner."
          : "Completion requires every current session to be released and available and every non-cancelled enrollment to be completed. This course does not issue certificates."
        : "This changes the operational lifecycle of the batch.";
    if (!window.confirm(`Move this batch to ${status}?\n\n${detail}`)) return;
    try {
      await updateStatus({ batchId: batch.id, status }).unwrap();
      toast.success(`Batch moved to ${status}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update batch status"));
    }
  };

  const nextStatuses = transitions[batch.status];
  return (
    <div className="flex items-center gap-2">
      <BatchStatusBadge status={batch.status} />
      {nextStatuses.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              aria-label="Batch lifecycle actions"
              disabled={updateState.isLoading}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {nextStatuses.map((status) => (
              <DropdownMenuItem key={status} onSelect={() => moveTo(status)}>
                Move to {status.toLowerCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
