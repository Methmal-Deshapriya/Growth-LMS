import { Badge } from "@/components/ui/badge";
import type { CatalogStatus } from "../catalogApi";

const STATUS_LABELS: Record<CatalogStatus, string> = {
  PUBLISHED: "Published",
  DRAFT: "Unpublished",
  ARCHIVED: "Archived",
};

const STATUS_CLASSES: Record<CatalogStatus, string> = {
  PUBLISHED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  DRAFT: "border-border bg-muted text-muted-foreground",
  ARCHIVED:
    "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-300",
};

export function CatalogStatusBadge({ status }: { status: CatalogStatus }) {
  return (
    <Badge variant="outline" className={STATUS_CLASSES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
