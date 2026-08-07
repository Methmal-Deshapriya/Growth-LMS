"use client";

import React from "react";
import { UserRecord } from "../usersTypes";
import { usePromoteUserMutation, useDemoteUserMutation } from "../usersApi";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Mail,
  ShieldAlert,
  ShieldCheck,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api";

interface UserTableProps {
  users: UserRecord[];
  canManageRoles: boolean;
}

/**
 * UserTable Component
 *
 * A administrative table for Super Admins to manage user roles.
 */
export default function UserTable({ users, canManageRoles }: UserTableProps) {
  const [promote, { isLoading: isPromoting }] = usePromoteUserMutation();
  const [demote, { isLoading: isDemoting }] = useDemoteUserMutation();

  const handlePromote = async (id: string, name: string) => {
    if (
      !window.confirm(`Are you sure you want to promote "${name}" to ADMIN?`)
    ) {
      return;
    }

    try {
      await promote(id).unwrap();
      toast.success(`${name} has been promoted to ADMIN`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Promotion failed"));
    }
  };

  const handleDemote = async (id: string, name: string) => {
    if (
      !window.confirm(`Are you sure you want to demote "${name}" to STUDENT?`)
    ) {
      return;
    }

    try {
      await demote(id).unwrap();
      toast.success(`${name} has been demoted to STUDENT`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Demotion failed"));
    }
  };

  return (
    <div className="overflow-hidden bg-card rounded-2xl border border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                User Identity
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Member Since
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">
                Access Control
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-muted/50 transition-colors group"
              >
                {/* 1. Identity */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                          : user.role === "ADMIN"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {user.firstName} {user.lastName}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Role Badge */}
                <td className="px-6 py-4">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      user.role === "SUPER_ADMIN"
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/40"
                        : user.role === "ADMIN"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-background text-foreground border-border",
                    )}
                  >
                    {user.role === "SUPER_ADMIN" ? (
                      <ShieldAlert className="h-3 w-3" />
                    ) : (
                      <ShieldCheck className="h-3 w-3" />
                    )}
                    {user.role}
                  </div>
                </td>

                {/* 3. Joined Date */}
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </span>
                </td>

                {/* 4. Actions (Access Control) */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Promote: only if current role is STUDENT */}
                    {canManageRoles && user.role === "STUDENT" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromote(user.id, `${user.firstName} ${user.lastName}`)}
                        className="h-8 text-xs font-bold text-primary border-primary/20 hover:bg-primary/10 hover:text-primary"
                        disabled={isPromoting}
                      >
                        <ArrowUpCircle className="mr-1.5 h-3.5 w-3.5" />
                        PROMOTE
                      </Button>
                    )}

                    {/* Demote: only if current role is ADMIN */}
                    {canManageRoles && user.role === "ADMIN" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemote(user.id, `${user.firstName} ${user.lastName}`)}
                        className="h-8 text-xs font-bold text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/40 hover:bg-orange-50 dark:bg-orange-950/40 hover:text-orange-700 dark:text-orange-400"
                        disabled={isDemoting}
                      >
                        <ArrowDownCircle className="mr-1.5 h-3.5 w-3.5" />
                        DEMOTE
                      </Button>
                    )}

                    {/* Super Admin Protection */}
                    {canManageRoles && user.role === "SUPER_ADMIN" && (
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background px-3 py-1 rounded-md border border-border">
                        PROTECTED
                      </span>
                    )}
                    {!canManageRoles && <span className="text-xs text-muted-foreground">View only</span>}
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
