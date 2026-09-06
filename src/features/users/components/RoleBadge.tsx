import { ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/constants";

/** The same role-badge look used on the admin Users table, factored out so
 * the user detail sheet and account page render it identically. */
export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        role === "SUPER_ADMIN"
          ? "border-purple-500/20 bg-purple-500/10 text-purple-700"
          : role === "ADMIN"
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-border bg-muted text-muted-foreground",
      )}
    >
      {role === "SUPER_ADMIN" ? (
        <ShieldAlert className="size-3" aria-hidden="true" />
      ) : (
        <ShieldCheck className="size-3" aria-hidden="true" />
      )}
      {role.replace("_", " ")}
    </span>
  );
}
