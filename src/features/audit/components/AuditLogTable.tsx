"use client";

import React from "react";
import { AuditLog } from "../auditTypes";
import { format } from "date-fns";
import {
  History,
  User as UserIcon,
  Activity,
  Database,
  Info,
  Clock,
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
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                When
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Actor
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Action
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Entity
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* 1. Time */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      {format(new Date(log.createdAt), "HH:mm:ss")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                      {format(new Date(log.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </td>

                {/* 2. Actor */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <UserIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700">
                        {log.actor.name}
                      </span>
                      {"email" in log.actor && (
                        <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
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
                        ? "bg-green-50 text-green-700 border-green-100"
                        : log.action.includes("DELETED")
                          ? "bg-red-50 text-red-700 border-red-100"
                          : log.action.includes("PROMOTED")
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : "bg-blue-50 text-blue-700 border-blue-100",
                    )}
                  >
                    <Activity className="h-3 w-3" />
                    {log.action.replace(/_/g, " ")}
                  </div>
                </td>

                {/* 4. Entity */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                      <Database className="h-3 w-3" />
                      {log.entityType}
                    </div>
                    {log.entityId && (
                      <span className="text-[10px] font-mono text-gray-300">
                        ID: {log.entityId.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                </td>

                {/* 5. Description */}
                <td className="px-6 py-4 max-w-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-gray-300 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600 leading-tight italic">
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
