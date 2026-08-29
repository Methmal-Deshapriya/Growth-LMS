"use client";

import { format } from "date-fns";
import { Activity, Database, Info, Loader2, User as UserIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AuditLog } from "../auditTypes";

export default function AuditLogTable({
  logs,
  isLoading = false,
  isError = false,
  isFetching = false,
  emptyMessage = "No audit events match the current filter.",
}: {
  logs: AuditLog[];
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border bg-card" aria-busy={isLoading || isFetching}>
      <Table>
        <TableCaption className="sr-only">Administrative audit history</TableCaption>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="px-4">When</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead className="pr-4">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={cn(isFetching && !isLoading && "opacity-60")}>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Retrieving system history…
                </span>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 whitespace-normal text-center text-destructive">
                <span role="alert">Could not load the audit logs. Please try again.</span>
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 whitespace-normal text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="px-4 py-4">
                  <p className="font-mono text-sm font-medium">{format(new Date(log.createdAt), "HH:mm:ss")}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "MMM dd, yyyy")}</p>
                </TableCell>
                <TableCell className="max-w-xs whitespace-normal">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserIcon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{log.actor.firstName} {log.actor.lastName}</p>
                      {"email" in log.actor ? <p className="truncate text-xs text-muted-foreground">{log.actor.email}</p> : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                      log.action.includes("CREATED")
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                        : log.action.includes("DELETED")
                          ? "border-destructive/20 bg-destructive/10 text-destructive"
                          : log.action.includes("PROMOTED")
                            ? "border-purple-500/20 bg-purple-500/10 text-purple-700"
                            : "border-primary/20 bg-primary/10 text-primary",
                    )}
                  >
                    <Activity className="size-3" aria-hidden="true" />
                    {log.action.replaceAll("_", " ")}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                    <Database className="size-3" aria-hidden="true" /> {log.entityType}
                  </p>
                  {log.entityId ? <p className="font-mono text-xs text-muted-foreground">{log.entityId.slice(0, 8)}…</p> : null}
                </TableCell>
                <TableCell className="max-w-md whitespace-normal pr-4">
                  <p className="flex items-start gap-2 leading-relaxed">
                    <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {log.description || "No description provided."}
                  </p>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
