"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  Mail,
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
import { RoleBadge } from "./RoleBadge";
import { VerifiedBadge } from "./VerifiedBadge";
import UserDetailSheet from "./UserDetailSheet";

const INTERACTIVE_SELECTOR = "button,a,[data-no-row-navigation]";

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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
            <TableHead>Verification</TableHead>
            <TableHead>Member since</TableHead>
            <TableHead className="pr-4 text-right">Access control</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={cn(isFetching && !isLoading && "opacity-60")}>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Loading user records…
                </span>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 whitespace-normal text-center text-destructive">
                <span role="alert">Could not retrieve the user list. Please try again.</span>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 whitespace-normal text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const name = `${user.firstName} ${user.lastName}`;
              return (
                <TableRow
                  key={user.id}
                  tabIndex={0}
                  aria-label={`View details for ${name}`}
                  className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={(event) => {
                    if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
                    setSelectedUserId(user.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedUserId(user.id);
                    }
                  }}
                >
                  <TableCell className="max-w-sm whitespace-normal px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full",
                          user.role === "SUPER_ADMIN"
                            ? "bg-purple-500/10 text-purple-600"
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
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <VerifiedBadge verified={user.emailVerified} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="pr-4 text-right" data-no-row-navigation>
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
      <UserDetailSheet
        userId={selectedUserId}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        canManageRoles={canManageRoles}
      />
    </div>
  );
}
