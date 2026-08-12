"use client";

import React, { useState } from "react";
import { useGetAuditLogsQuery } from "@/features/audit/auditApi";
import AuditLogTable from "@/features/audit/components/AuditLogTable";
import { History, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole } from "@/features/auth/authSelectors";
import { canViewAuditLogs } from "@/lib/access";
import { Button } from "@/components/ui/button";

/**
 * Admin Audit Logs Page
 * 
 * Provides a high-fidelity dashboard for Super Admins to monitor system activity.
 */
export default function AdminAuditPage() {
  const role = useAppSelector(selectAuthRole);
  
  // State for filters and pagination
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [action, setAction] = useState("");

  // Fetch logs with current filters
  const { data, isLoading, isError, isFetching } = useGetAuditLogsQuery({
    limit,
    offset,
    action: action || undefined,
  });

  // --- Security Check ---
  if (!canViewAuditLogs(role)) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">Access Restricted</h2>
        <p className="text-red-700 dark:text-red-400">
          Only Super Administrators can view system audit logs.
        </p>
      </div>
    );
  }

  const handleNext = () => {
    if (data?.pagination.hasMore) {
      setOffset(offset + limit);
    }
  };

  const handlePrev = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <History className="text-primary h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            System-wide activity history and accountability tracking.
          </p>
        </div>

        {/* Filter Bar Simple */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select 
              className="pl-10 pr-8 h-10 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setOffset(0); // Reset to first page on filter change
              }}
            >
              <option value="">All Actions</option>
              <option value="USER_PROMOTED">User Promoted</option>
              <option value="USER_DEMOTED">User Demoted</option>
              <option value="CATEGORY_CREATED">Category Created</option>
              <option value="COURSE_CREATED">Course Created</option>
              <option value="COURSE_PUBLISHED">Course Published</option>
              <option value="COURSE_ARCHIVED">Course Archived</option>
              <option value="STUDENT_ENROLLED">Student Enrolled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AuditLogTable
          logs={data?.logs ?? []}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
        />

        {data && data.pagination.total > 0 ? (
          <div className="flex items-center justify-between bg-card px-6 py-4 rounded-xl border border-border shadow-sm">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{offset + 1}</span> to <span className="font-bold text-foreground">{offset + data.logs.length}</span> of <span className="font-bold text-foreground">{data.pagination.total}</span> logs
            </p>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrev} 
                disabled={offset === 0 || isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNext} 
                disabled={!data.pagination.hasMore || isFetching}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
