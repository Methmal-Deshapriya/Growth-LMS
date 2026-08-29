import type { ReactNode } from "react";

export interface AdminSummaryItem {
  label: string;
  value: ReactNode;
  detail?: string;
}

export function AdminSummaryStrip({ items }: { items: AdminSummaryItem[] }) {
  return (
    <dl className="grid overflow-hidden rounded-md border bg-card sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-b p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-1 font-mono text-xl font-semibold tabular-nums text-foreground">
            {item.value}
          </dd>
          {item.detail ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.detail}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
