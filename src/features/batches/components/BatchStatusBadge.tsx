import { Badge } from "@/components/ui/badge";
import type { BatchStatus } from "../batchesTypes";

const STATUS_LABELS: Record<BatchStatus, string> = {
  DRAFT: "Draft",
  ENROLLING: "Enrolling",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ARCHIVED: "Archived",
};

const STATUS_CLASSES: Record<BatchStatus, string> = {
  DRAFT: "border-border bg-muted text-muted-foreground",
  ENROLLING:
    "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  ACTIVE:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  COMPLETED:
    "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  CANCELLED:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  ARCHIVED:
    "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-300",
};

export function BatchStatusBadge({ status }: { status: BatchStatus }) {
  return (
    <Badge variant="outline" className={STATUS_CLASSES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
