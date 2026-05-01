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
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: UserRecord[];
}

/**
 * UserTable Component
 *
 * A administrative table for Super Admins to manage user roles.
 */
export default function UserTable({ users }: UserTableProps) {
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
    } catch (err: any) {
      toast.error(err.message || "Promotion failed");
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
    } catch (err: any) {
      toast.error(err.message || "Demotion failed");
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                User Identity
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Member Since
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                Access Control
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                {/* 1. Identity */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-50 text-purple-600"
                          : user.role === "ADMIN"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-500",
                      )}
                    >
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {user.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
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
                        ? "bg-purple-50 text-purple-700 border-purple-100"
                        : user.role === "ADMIN"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-gray-50 text-gray-600 border-gray-100",
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
                  <span className="text-sm text-gray-500">
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </span>
                </td>

                {/* 4. Actions (Access Control) */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Promote: only if current role is STUDENT */}
                    {user.role === "STUDENT" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromote(user.id, user.name)}
                        className="h-8 text-xs font-bold text-blue-600 border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                        disabled={isPromoting}
                      >
                        <ArrowUpCircle className="mr-1.5 h-3.5 w-3.5" />
                        PROMOTE
                      </Button>
                    )}

                    {/* Demote: only if current role is ADMIN */}
                    {user.role === "ADMIN" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemote(user.id, user.name)}
                        className="h-8 text-xs font-bold text-orange-600 border-orange-100 hover:bg-orange-50 hover:text-orange-700"
                        disabled={isDemoting}
                      >
                        <ArrowDownCircle className="mr-1.5 h-3.5 w-3.5" />
                        DEMOTE
                      </Button>
                    )}

                    {/* Super Admin Protection */}
                    {user.role === "SUPER_ADMIN" && (
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                        PROTECTED
                      </span>
                    )}
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
