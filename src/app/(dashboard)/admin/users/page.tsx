"use client";

import React, { useState } from "react";
import { useGetUsersQuery } from "@/features/users/usersApi";
import UserTable from "@/features/users/components/UserTable";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { canManageUsers, canViewUsers } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { ROLES, type Role } from "@/lib/constants";

/**
 * Admin User Management Page
 * 
 * Allows admins to view users and super admins to manage roles.
 */
export default function AdminUsersPage() {
  const user = useAppSelector(selectAuthUser);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const { data, isLoading, isError, isFetching } = useGetUsersQuery({
    limit,
    offset,
    role: selectedRole || undefined,
  });

  // --- Security Check (Double protection) ---
  if (!canViewUsers(user)) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Access Restricted</h2>
        <p className="text-red-700">
          You do not have permission to view platform users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Oversee platform users, manage access levels, and promote administrators.
          </p>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <select
            className="h-10 min-w-44 appearance-none rounded-lg border border-border bg-card pl-10 pr-8 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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

      <div className="space-y-6">
        <UserTable
          users={data?.users ?? []}
          canManageRoles={canManageUsers(user)}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          emptyMessage={
            selectedRole
              ? "No users match the selected role."
              : "No platform users have been registered yet."
          }
        />

        {data && data.pagination.total > 0 ? (
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{offset + 1}</span> to{" "}
              <span className="font-bold text-foreground">{offset + data.users.length}</span> of{" "}
              <span className="font-bold text-foreground">{data.pagination.total}</span> users
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
        ) : null}
      </div>
    </div>
  );
}
