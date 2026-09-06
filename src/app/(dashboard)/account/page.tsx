"use client";

import { format } from "date-fns";
import { Mail, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AccountProfileForm from "@/features/auth/components/AccountProfileForm";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { RoleBadge } from "@/features/users/components/RoleBadge";
import { VerifiedBadge } from "@/features/users/components/VerifiedBadge";
import { useAppSelector } from "@/store/hooks";

function getInitials(firstName?: string, lastName?: string) {
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`;
  return initials.toUpperCase() || "U";
}

/**
 * My Account — every logged-in user's own profile: contact/personal
 * details (editable), role, and member-since. Login already requires a
 * verified email (see loginService), so reaching this page guarantees
 * emailVerified is true — the badge below is just a status confirmation,
 * not an action; actual verification happens pre-login at /verify-email.
 */
export default function AccountPage() {
  const user = useAppSelector(selectAuthUser);

  if (!user) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar className="h-14 w-14 rounded-2xl">
          <AvatarFallback className="rounded-2xl bg-primary text-lg text-primary-foreground">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {user.firstName} {user.lastName}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-3.5" aria-hidden="true" />
            {user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RoleBadge role={user.role} />
          <VerifiedBadge verified={user.emailVerified} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        <UserIcon className="mr-1 inline size-3" aria-hidden="true" />
        Member since {format(new Date(user.createdAt), "MMM dd, yyyy")}
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Profile details</h2>
        <div className="rounded-xl border bg-card p-6">
          <AccountProfileForm user={user} />
        </div>
      </section>
    </div>
  );
}
