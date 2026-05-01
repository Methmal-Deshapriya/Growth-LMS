"use client";

import React, { useState } from "react";
import { useGetUsersQuery } from "@/features/users/usersApi";
import UserTable from "@/features/users/components/UserTable";
import { Loader2, Users, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole } from "@/features/auth/authSelectors";
import { canManageUsers } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { ROLES, type Role } from "@/lib/constants";

/**
 * Admin User Management Page
 * 
 * Allows Super Admins to view all users and manage their platform roles.
 */
export default function AdminUsersPage() {
  const role = useAppSelector(selectAuthRole);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const { data, isLoading, isError, isFetching } = useGetUsersQuery({
    limit,
    offset,
    role: selectedRole || undefined,
  });

  // --- Security Check (Double protection) ---
  if (!canManageUsers(role)) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Access Restricted</h2>
        <p className="text-red-700">
          Only Super Administrators can access the user management console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">
            Oversee platform users, manage access levels, and promote administrators.
          </p>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <select
            className="h-10 min-w-44 appearance-none rounded-lg border border-gray-200 bg-white pl-10 pr-8 text-sm outline-none focus:ring-2 focus:ring-blue-600/20"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value as Role | "");
              setOffset(0);
            }}
          >
            <option value="">All Roles</option>
            <option value={ROLES.STUDENT}>Students</option>
            <option value={ROLES.ADMIN}>Admins</option>
            <option value={ROLES.SUPER_ADMIN}>Super Admins</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-medium">Loading user records...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Service Error</h2>
          <p className="text-red-700">
            We couldn&apos;t retrieve the user list. Please try again later.
          </p>
        </div>
      ) : data && data.users.length > 0 ? (
        <div className="space-y-6">
          <div className={isFetching ? "pointer-events-none opacity-50 transition-opacity" : ""}>
            <UserTable users={data.users} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{offset + 1}</span> to{" "}
              <span className="font-bold text-gray-900">{offset + data.users.length}</span> of{" "}
              <span className="font-bold text-gray-900">{data.pagination.total}</span> users
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0 || isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(offset + limit)}
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
            <Users className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No users found</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {selectedRole
              ? "No users match the selected role right now."
              : "It looks like there are no registered users on the platform yet."}
          </p>
        </div>
      )}
    </div>
  );
}
