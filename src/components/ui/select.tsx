"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Custom dropdown matching the app's Input styling (rounded-xl, muted
 * background, leading icon) — no native <select> chrome, so it looks
 * consistent across browsers/OSes. The option list caps at max-h-64 and
 * scrolls internally, which matters for the 25-entry district list.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { value, onChange, onBlur, options, placeholder = "Select...", icon: Icon, error, disabled, className, id },
  ref
) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onBlur]);

  return (
    <div ref={containerRef} className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-3.5 z-10 h-4 w-4 text-muted-foreground" />
      )}
      <button
        ref={ref}
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-12 w-full items-center rounded-xl border border-input bg-muted/50 pl-10 pr-10 py-2 text-left text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground",
          error && "border-red-500 focus-visible:border-red-500",
          className
        )}
      >
        {value || placeholder}
      </button>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-muted-foreground transition-transform",
          open && "rotate-180"
        )}
      />
      {open && (
        <div
          role="listbox"
          className="catalog-scrollbar absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-input bg-white p-1.5 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                value === option ? "bg-blue-50 font-medium text-blue-600" : "text-[#0E1116]"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
