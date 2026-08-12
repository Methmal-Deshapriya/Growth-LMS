import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api";
import type { CatalogDeletionImpact } from "../catalogApi";

export function CatalogDeletionImpactSummary({
  impact,
  isLoading,
  error,
}: {
  impact?: CatalogDeletionImpact;
  isLoading: boolean;
  error?: unknown;
}) {
  if (isLoading) {
    return (
      <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground" aria-live="polite">
        Checking operational batches and learner history…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
        {getApiErrorMessage(error, "Could not check whether permanent deletion is safe.")}
      </div>
    );
  }

  if (!impact) return null;

  const { summary } = impact;
  const inventory = [
    ["Courses", summary.courses],
    ["Batches", summary.batches],
    ["Curriculum links", summary.curriculumLinks],
    ["Enrollments", summary.enrollments],
  ] as const;

  return (
    <div
      className={
        impact.canDelete
          ? "space-y-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3"
          : "space-y-3 rounded-md border border-destructive/40 bg-destructive/10 p-3"
      }
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        {impact.canDelete ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        ) : (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        )}
        <div>
          <p className="text-sm font-semibold">
            {impact.canDelete
              ? "No protected learning history was found"
              : "Permanent deletion is blocked"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {impact.canDelete
              ? "Only unused catalog setup will be removed. Reusable Session Library resources are preserved."
              : "Keep this item archived. Archiving does not interrupt existing learner access."}
          </p>
        </div>
      </div>

      {!impact.canDelete ? (
        <ul className="space-y-1 pl-6 text-xs text-foreground">
          {impact.blockers.map((item) => (
            <li key={item.code} className="list-disc">
              {item.message} ({item.count})
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {inventory.map(([label, value]) => (
          <div key={label} className="rounded border bg-background/60 px-2 py-1.5">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
