"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  Award,
  Clock,
  GraduationCap,
  Loader2,
  ScrollText,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole } from "@/features/auth/authSelectors";
import { isSuperAdmin } from "@/lib/access";
import { useGetAuditLogsQuery } from "@/features/audit/auditApi";
import { useGetAdminDashboardQuery } from "../dashboardApi";

function StatCard({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      </div>
    </div>
  );
}

const QUICK_LINKS = [
  { href: "/admin/services", label: "Manage catalog", icon: GraduationCap },
  { href: "/admin/sessions", label: "Session Library", icon: ScrollText },
  { href: "/admin/users", label: "Manage users", icon: UserCog },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
];

/**
 * The admin/super-admin dashboard: platform-wide counts from
 * GET /dashboard/admin, plus jump-off points into the admin sections. The
 * recent-activity panel only renders for super admins, since audit-log
 * access (AUDIT_VIEW) is a super-admin-only permission.
 */
export default function AdminDashboard() {
  const role = useAppSelector(selectAuthRole);
  const { data, isLoading } = useGetAdminDashboardQuery();
  const { data: auditData, isLoading: isAuditLoading } = useGetAuditLogsQuery(
    { limit: 5 },
    { skip: !isSuperAdmin(role) },
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin overview</h1>
        <p className="mt-1 text-muted-foreground">Platform-wide activity at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total students"
          value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : data?.totalStudents ?? 0}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          icon={GraduationCap}
          label="Active enrollments"
          value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : data?.totalActiveEnrollments ?? 0}
          iconClassName="bg-sky-50 text-sky-600"
        />
        <StatCard
          icon={Clock}
          label="Pending enrollment requests"
          value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : data?.pendingEnrollmentRequests ?? 0}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={Award}
          label="Certificates issued"
          value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : data?.totalCertificatesIssued ?? 0}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground">Quick links</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm hover:bg-muted/50"
              >
                <span className="flex items-center gap-3 font-medium text-foreground">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        {isSuperAdmin(role) ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-purple-600" aria-hidden="true" /> Recent activity
              </h2>
              <Link href="/admin/audit" className="text-sm font-semibold text-primary hover:text-primary/80">
                View all
              </Link>
            </div>
            {isAuditLoading ? (
              <p className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </p>
            ) : !auditData || auditData.logs.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No recent activity yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {auditData.logs.map((log) => (
                  <li key={log.id} className="p-4 text-sm">
                    <p className="text-foreground">{log.description ?? log.action.replace(/_/g, " ").toLowerCase()}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {log.actor.firstName} {log.actor.lastName} · {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
