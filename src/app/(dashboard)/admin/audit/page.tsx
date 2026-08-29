"use client";

import React, { useState } from "react";
import { useGetAuditLogsQuery } from "@/features/audit/auditApi";
import AuditLogTable from "@/features/audit/components/AuditLogTable";
import { History, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { canViewAuditLogs } from "@/lib/access";
import { Button } from "@/components/ui/button";

/**
 * Admin Audit Logs Page
 * 
 * Provides a high-fidelity dashboard for Super Admins to monitor system activity.
 */
export default function AdminAuditPage() {
  const user = useAppSelector(selectAuthUser);
  
  // State for filters and pagination
  const [limit] = useState(50);
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<Array<string | undefined>>([]);
  const [action, setAction] = useState("");

  // Fetch logs with current filters
  const { data, isLoading, isError, isFetching } = useGetAuditLogsQuery({
    limit,
    cursor,
    action: action || undefined,
  });

  // --- Security Check ---
  if (!canViewAuditLogs(user)) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Access Restricted</h2>
        <p className="text-red-700">
          Only Super Administrators can view system audit logs.
        </p>
      </div>
    );
  }

  const handleNext = () => {
    if (data?.pagination.hasMore && data.pagination.nextCursor) {
      setCursorHistory((history) => [...history, cursor]);
      setCursor(data.pagination.nextCursor);
    }
  };

  const handlePrev = () => {
    if (cursorHistory.length === 0) return;
    setCursor(cursorHistory.at(-1));
    setCursorHistory((history) => history.slice(0, -1));
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
                setCursor(undefined);
                setCursorHistory([]);
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
              Showing <span className="font-bold text-foreground">{cursorHistory.length * limit + 1}</span> to <span className="font-bold text-foreground">{cursorHistory.length * limit + data.logs.length}</span> of <span className="font-bold text-foreground">{data.pagination.total}</span> logs
            </p>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrev} 
                disabled={cursorHistory.length === 0 || isFetching}
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
