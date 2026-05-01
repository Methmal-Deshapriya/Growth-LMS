"use client";

import React, { useState } from "react";
import { useGetAuditLogsQuery } from "@/features/audit/auditApi";
import AuditLogTable from "@/features/audit/components/AuditLogTable";
import { 
  Loader2, 
  History, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
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
      <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Access Restricted</h2>
        <p className="text-red-700">
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <History className="text-blue-600 h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-gray-500 mt-1">
            System-wide activity history and accountability tracking.
          </p>
        </div>

        {/* Filter Bar Simple */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select 
              className="pl-10 pr-8 h-10 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 outline-none appearance-none cursor-pointer"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setOffset(0); // Reset to first page on filter change
              }}
            >
              <option value="">All Actions</option>
              <option value="USER_PROMOTED">User Promoted</option>
              <option value="USER_DEMOTED">User Demoted</option>
              <option value="BOOTCAMP_CREATED">Bootcamp Created</option>
              <option value="BOOTCAMP_DELETED">Bootcamp Deleted</option>
              <option value="STUDENT_ENROLLED">Student Enrolled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-medium">Retrieving system history...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Service Error</h2>
          <p className="text-red-700">
            We couldn&apos;t load the audit logs. Please try again.
          </p>
        </div>
      ) : data && data.logs.length > 0 ? (
        <div className="space-y-6">
          <div className={isFetching ? "opacity-50 pointer-events-none transition-opacity" : ""}>
            <AuditLogTable logs={data.logs} />
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{offset + 1}</span> to <span className="font-bold text-gray-900">{offset + data.logs.length}</span> of <span className="font-bold text-gray-900">{data.pagination.total}</span> logs
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
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No logs found</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your filters or check back later as system actions are recorded.
          </p>
        </div>
      )}
    </div>
  );
}
