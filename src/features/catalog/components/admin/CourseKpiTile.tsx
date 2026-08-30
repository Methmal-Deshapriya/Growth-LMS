import type { ReactNode } from "react";

// Non-interactive stat tile — same visual language as the Session Library
// filter pills (rounded-md border, KPI-style number), but these don't
// filter anything, they just report.
export function CourseKpiTile({
  label,
  value,
  secondary,
}: {
  label: string;
  value: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className="min-w-40 flex-1 rounded-md border border-input bg-card px-4 py-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {secondary ? <p className="mt-0.5 text-xs text-muted-foreground">{secondary}</p> : null}
    </div>
  );
}
