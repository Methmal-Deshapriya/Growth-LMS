"use client";

import { cn } from "@/lib/utils";

export interface FilterPillOption<TKey extends string> {
  key: TKey;
  label: string;
  count: number;
  activeClassName: string;
}

// The "KPIs that double as filters" pattern established for Session
// Library's status row — reused everywhere a table needs status pills
// with live counts instead of a plain filter dropdown.
export function FilterPills<TKey extends string>({
  options,
  active,
  onChange,
  ariaLabel,
}: {
  options: FilterPillOption<TKey>[];
  active: TKey;
  onChange: (key: TKey) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex shrink-0 flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map(({ key, label, count, activeClassName }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(key)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-colors",
              isActive ? activeClassName : "border-input text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
            <span
              className={cn(
                "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                isActive ? "bg-background/60" : "bg-muted",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
