import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// The one stat-tile component for the catalog admin area — see the
// 2026-08-31 course detail page improvement plan §2: this used to have three
// slightly different hand-rolled versions across sibling pages (this one,
// AdminSummaryStrip, and an inline grid on the course detail page). Standardized
// on this one everywhere.
export function CourseKpiTile({
  label,
  value,
  secondary,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  secondary?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="min-w-40 flex-1 rounded-md border border-input bg-card px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {secondary ? <p className="mt-0.5 text-xs text-muted-foreground">{secondary}</p> : null}
    </div>
  );
}
