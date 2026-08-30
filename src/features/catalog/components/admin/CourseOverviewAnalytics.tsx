"use client";

import { Loader2 } from "lucide-react";
import { useGetIntakeAnalyticsQuery } from "@/features/catalog/catalogApi";
import { formatLKR } from "@/lib/utils";

// A ranked, length-encoded bar — one hue, magnitude only (no categorical
// color needed since there's exactly one series). Follows the dataviz
// skill's "meter" spec: accent fill, unfilled track a lighter step of the
// same ramp, value labeled at the tip rather than inside the bar.
function MagnitudeBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.min((count / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-foreground">{label}</span>
        <span className="shrink-0 font-medium tabular-nums text-muted-foreground">{count}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Status is a reserved palette, not a categorical series — reuses the exact
// colors ClassRosterTable already uses for the same three EnrollmentStatus
// values, paired with a visible label (never color alone).
const STATUS_DOT_COLOR: Record<"ACTIVE" | "COMPLETED" | "CANCELLED", string> = {
  ACTIVE: "bg-sky-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-destructive",
};

function StatRow({ dotClassName, label, count }: { dotClassName?: string; label: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-foreground">
        {dotClassName ? <span className={`size-2 shrink-0 rounded-full ${dotClassName}`} aria-hidden="true" /> : null}
        {label}
      </span>
      <span className="font-medium tabular-nums text-muted-foreground">{count}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-md border border-input bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function CourseOverviewAnalytics({ intakeId }: { intakeId: string }) {
  const { data, isLoading, isError } = useGetIntakeAnalyticsQuery(intakeId);

  if (isLoading) {
    return (
      <p role="status" aria-live="polite" className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading analytics…
      </p>
    );
  }
  if (isError || !data) {
    return <p className="py-16 text-center text-sm text-destructive">Could not load course analytics.</p>;
  }

  const topDistrict = data.districts[0];
  const districtMax = data.districts.reduce((max, row) => Math.max(max, row.count), 0);
  const sessionMax = data.sessionEngagement.reduce((max, row) => Math.max(max, row.eligible), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Section title="Where students are enrolling from">
        <p className="text-xs text-muted-foreground">
          {data.districts.length > 0
            ? `${data.districts.length} of 25 districts represented${topDistrict ? ` — ${topDistrict.district} leads with ${topDistrict.count}` : ""}.`
            : "No enrolled students yet."}
        </p>
        {data.districts.length > 0 ? (
          <div className="space-y-2.5">
            {data.districts.map((row) => (
              <MagnitudeBar key={row.district} label={row.district} count={row.count} max={districtMax} />
            ))}
          </div>
        ) : null}
      </Section>

      <Section title="Enrollment status">
        <div className="space-y-2">
          <StatRow dotClassName={STATUS_DOT_COLOR.ACTIVE} label="Active" count={data.enrollments.active} />
          <StatRow dotClassName={STATUS_DOT_COLOR.COMPLETED} label="Completed" count={data.enrollments.completed} />
          <StatRow dotClassName={STATUS_DOT_COLOR.CANCELLED} label="Cancelled" count={data.enrollments.cancelled} />
        </div>
      </Section>

      <Section title="Payments collected">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Full payment</span>
            <span className="font-medium tabular-nums text-muted-foreground">
              {data.payments.full.count} · {formatLKR(data.payments.full.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Partial</span>
            <span className="font-medium tabular-nums text-muted-foreground">
              {data.payments.partial.count} · {formatLKR(data.payments.partial.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Top-up (remaining half)</span>
            <span className="font-medium tabular-nums text-muted-foreground">
              {data.payments.topUp.count} · {formatLKR(data.payments.topUp.amount)}
            </span>
          </div>
        </div>
      </Section>

      <Section title="Session engagement">
        {data.sessionEngagement.length > 0 ? (
          <div className="space-y-2.5">
            {data.sessionEngagement.map((row) => (
              <MagnitudeBar
                key={row.courseSessionId}
                label={row.title}
                count={row.completions}
                max={sessionMax}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No curriculum attached yet.</p>
        )}
      </Section>

      <Section title="Projects & certificates">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="font-semibold tabular-nums">{data.projects.pending}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Approved</p>
            <p className="font-semibold tabular-nums">{data.projects.approved}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rejected</p>
            <p className="font-semibold tabular-nums">{data.projects.rejected}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Certificates</p>
            <p className="font-semibold tabular-nums">
              {data.successRate.certificatesIssued} / {data.successRate.certificateEligible}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
