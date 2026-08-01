"use client";

import React from "react";
import { AuditLog } from "../auditTypes";
import { format } from "date-fns";
import {
  User as UserIcon,
  Activity,
  Database,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLogTableProps {
  logs: AuditLog[];
}

/**
 * AuditLogTable Component
 *
 * Displays a detailed history of system actions for accountability.
 */
export default function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="overflow-hidden bg-card rounded-2xl border border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                When
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Actor
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Action
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Entity
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-muted/50 transition-colors"
              >
                {/* 1. Time */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {format(new Date(log.createdAt), "HH:mm:ss")}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                      {format(new Date(log.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </td>

                {/* 2. Actor */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <UserIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {log.actor.firstName} {log.actor.lastName}
                      </span>
                      {"email" in log.actor && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                          {log.actor.email}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* 3. Action Type */}
                <td className="px-6 py-4">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      log.action.includes("CREATED")
                        ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/40"
                        : log.action.includes("DELETED")
                          ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40"
                          : log.action.includes("PROMOTED")
                            ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/40"
                            : "bg-primary/10 text-primary border-primary/20",
                    )}
                  >
                    <Activity className="h-3 w-3" />
                    {log.action.replace(/_/g, " ")}
                  </div>
                </td>

                {/* 4. Entity */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                      <Database className="h-3 w-3" />
                      {log.entityType}
                    </div>
                    {log.entityId && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        ID: {log.entityId.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                </td>

                {/* 5. Description */}
                <td className="px-6 py-4 max-w-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground leading-tight italic">
                      {log.description || "No description provided."}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
