"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Award, BookOpen, CheckCircle2, LayoutDashboard, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ENROLLMENT_STATUS_STYLES } from "@/lib/statusColors";
import { useGetStudentDashboardQuery } from "../dashboardApi";

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

/**
 * The student dashboard: their own enrollment/completion/certificate counts
 * and a quick jump back into their most recently touched courses. Everything
 * here comes from GET /dashboard/student — no placeholder numbers.
 */
export default function StudentDashboard({ firstName }: { firstName?: string }) {
  const { data, isLoading } = useGetStudentDashboardQuery();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {firstName}!</h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening with your learning journey today.
          </p>
        </div>
        <Button asChild className="bg-primary text-white hover:bg-primary/90">
          <Link href="/explore">
            Explore More Courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label="Your Courses"
          value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : data?.coursesEnrolled ?? 0}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : data?.coursesCompleted ?? 0}
          iconClassName="bg-green-50 text-green-600"
        />
        <StatCard
          icon={Award}
          label="Certificates earned"
          value={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : data?.certificatesEarned ?? 0}
          iconClassName="bg-violet-50 text-violet-600"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-bold text-foreground">Recently Accessed</h2>
          <Link href="/my-courses" className="text-sm font-semibold text-primary hover:text-primary/80">
            View all
          </Link>
        </div>
        {isLoading ? (
          <p className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : !data || data.recentEnrollments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background">
              <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-1 font-semibold text-foreground">No courses yet</h3>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground">
              Once you enroll in a course, it will show up here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.recentEnrollments.map((enrollment) => (
              <li key={enrollment.id}>
                <Link
                  href={`/my-courses/${enrollment.id}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {enrollment.courseTitle ?? "Untitled course"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enrollment.intakeCode} · Updated {format(new Date(enrollment.updatedAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <Badge variant="outline" className={ENROLLMENT_STATUS_STYLES[enrollment.status]}>
                    {enrollment.status.charAt(0) + enrollment.status.slice(1).toLowerCase()}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
