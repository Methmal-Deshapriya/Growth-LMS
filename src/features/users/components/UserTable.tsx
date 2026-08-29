"use client";

import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDemoteUserMutation, usePromoteUserMutation } from "../usersApi";
import type { UserRecord } from "../usersTypes";

interface UserTableProps {
  users: UserRecord[];
  canManageRoles: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  emptyMessage?: string;
}

export default function UserTable({
  users,
  canManageRoles,
  isLoading = false,
  isError = false,
  isFetching = false,
  emptyMessage = "No users found.",
}: UserTableProps) {
  const [promote, { isLoading: isPromoting }] = usePromoteUserMutation();
  const [demote, { isLoading: isDemoting }] = useDemoteUserMutation();

  const handlePromote = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to promote "${name}" to ADMIN?`)) return;
    try {
      await promote(id).unwrap();
      toast.success(`${name} has been promoted to ADMIN`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Promotion failed"));
    }
  };

  const handleDemote = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to demote "${name}" to STUDENT?`)) return;
    try {
      await demote(id).unwrap();
      toast.success(`${name} has been demoted to STUDENT`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Demotion failed"));
    }
  };

  return (
    <div className="overflow-hidden rounded-md border bg-card" aria-busy={isLoading || isFetching}>
      <Table>
        <TableCaption className="sr-only">Platform users and their access roles</TableCaption>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="px-4">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Member since</TableHead>
            <TableHead className="pr-4 text-right">Access control</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={cn(isFetching && !isLoading && "opacity-60")}>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Loading user records…
                </span>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 whitespace-normal text-center text-destructive">
                <span role="alert">Could not retrieve the user list. Please try again.</span>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 whitespace-normal text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const name = `${user.firstName} ${user.lastName}`;
              return (
                <TableRow key={user.id}>
                  <TableCell className="max-w-sm whitespace-normal px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full",
                          user.role === "SUPER_ADMIN"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : user.role === "ADMIN"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        <UserIcon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">{name}</p>
                        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                          <Mail className="size-3" aria-hidden="true" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                        user.role === "SUPER_ADMIN"
                          ? "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300"
                          : user.role === "ADMIN"
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      {user.role === "SUPER_ADMIN" ? (
                        <ShieldAlert className="size-3" aria-hidden="true" />
                      ) : (
                        <ShieldCheck className="size-3" aria-hidden="true" />
                      )}
                      {user.role.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    {canManageRoles && user.role === "STUDENT" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromote(user.id, name)}
                        disabled={isPromoting}
                      >
                        <ArrowUpCircle className="size-4" aria-hidden="true" /> Promote
                      </Button>
                    ) : null}
                    {canManageRoles && user.role === "ADMIN" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemote(user.id, name)}
                        disabled={isDemoting}
                      >
                        <ArrowDownCircle className="size-4" aria-hidden="true" /> Demote
                      </Button>
                    ) : null}
                    {canManageRoles && user.role === "SUPER_ADMIN" ? (
                      <span className="text-xs text-muted-foreground">Protected</span>
                    ) : null}
                    {!canManageRoles ? <span className="text-xs text-muted-foreground">View only</span> : null}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
