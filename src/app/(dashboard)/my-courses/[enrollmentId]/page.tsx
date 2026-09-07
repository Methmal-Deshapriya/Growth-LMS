"use client";

import type { ElementType, ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  ExternalLink,
  FolderGit2,
  LockKeyhole,
  Loader2,
  Users,
  Wallet,
} from "lucide-react";
import { useGetClassroomQuery } from "@/features/sessions/sessionsApi";
import { useGetMyProjectsQuery } from "@/features/projects/projectsApi";
import SessionList from "@/features/sessions/components/SessionList";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CatalogIcon } from "@/components/marketing/catalog/visuals";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const PROJECT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Paid in full",
  PARTIAL: "Partially paid",
  NOT_REQUIRED: "No payment required",
};

// Compact "at a glance" tile — for short facts (a date, a status word), not
// the big-number KPI tiles used on the admin catalog pages, which read too
// heavy for text values like these.
function FactTile({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-44 flex-1 items-start gap-2.5 rounded-md border border-border bg-background px-3.5 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LearningPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const {
    data: classroom,
    isLoading,
    error,
  } = useGetClassroomQuery(enrollmentId);
  const { data: projectsPage } = useGetMyProjectsQuery({ limit: 50 });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="font-medium text-muted-foreground">
          Preparing your classroom...
        </p>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-12 text-center">
        <h2 className="mb-2 text-2xl font-bold text-red-900">
          Classroom unavailable
        </h2>
        <p className="mb-6 text-red-700">
          {getApiErrorMessage(
            error,
            "We could not load this classroom. Check your enrollment and try again.",
          )}
        </p>
        <Button asChild variant="outline">
          <Link href="/my-courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Courses
          </Link>
        </Button>
      </div>
    );
  }

  const { enrollment, sessions, progress } = classroom;
  const { course } = enrollment;
  const isCompletionHistoryReadOnly = enrollment.status === "COMPLETED";
  const isSeasonal = course.instanceKind === "SEASONAL";
  const showPayment =
    enrollment.source === "ADMIN" &&
    enrollment.paymentStatus !== "NOT_REQUIRED";
  const myProject = projectsPage?.projects.find(
    (project) => project.intakeId === progress.intakeId,
  );
  const hasHighlights = course.highlights.length > 0;
  const hasSkills = course.skills.length > 0;
  const hasPrerequisites = course.prerequisites.length > 0;
  const hasAboutContent =
    course.description || hasHighlights || hasSkills || hasPrerequisites;

  return (
    <StudentOnlyRoute description="Admins manage course delivery and enrollments from the admin area.">
      <div className="space-y-6 pb-20">
        <AdminCatalogBreadcrumbs
          crumbs={[
            { label: "My Courses", href: "/my-courses" },
            { label: course.title },
          ]}
        />

        {/* Backdrop + completion card, grouped in their own wrapper so the
            outer space-y-6 (which puts a sibling margin-top rule — higher
            specificity than a plain -mt-* utility — on every direct child)
            can't silently cancel the negative margin that pulls the
            completion card up to overlap the backdrop below. */}
        <div>
          {/* Cover-photo-style backdrop, styled as its own card like the
              rest of the page. Title sits inside the band; the completion
              card below overlaps its lower edge, straddling the two cards. */}
          <div className="flex items-center gap-4 rounded-lg border border-border bg-linear-to-b from-primary/25 via-primary/8 to-transparent px-6 pt-8 pb-40 shadow-sm sm:pt-10 sm:pb-48">
            <div className="relative hidden h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm sm:flex">
              {course.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- external, arbitrary admin-supplied URLs; next/image's domain allowlist would need constant upkeep
                <img
                  src={course.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <CatalogIcon
                  visualKey={course.categoryVisualKey}
                  className="h-6 w-6 text-primary/70"
                />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {course.serviceTitle} · {course.categoryTitle}
              </p>
              <h1 className="text-2xl font-bold text-foreground">
                {course.title}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                {isSeasonal ? (
                  <>
                    <Users className="h-4 w-4" />
                    {course.intakeKey} ({course.code})
                  </>
                ) : (
                  "Self-paced Free Learning"
                )}
              </p>
            </div>
          </div>

          {/* One "at a glance" card: progress + every quick fact together,
              inset from the backdrop's edges and floated up to overlap its
              bottom, so it reads as a narrower card sitting on top. */}
          <div className="-mt-10 mx-6 rounded-lg border border-border bg-card p-6 shadow-md sm:-mt-12 sm:mx-10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                Course Completion
              </p>
              <p className="text-sm font-bold text-primary">
                {progress.progressPercent}%
              </p>
            </div>
            <Progress value={progress.progressPercent} className="mt-2 h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {progress.completedCount} of {progress.availableSessionCount}{" "}
              available sessions completed
            </p>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
              <FactTile icon={Calendar} label="Enrolled">
                {format(new Date(enrollment.enrolledAt), "MMM d, yyyy")}
              </FactTile>

              {isSeasonal ? (
                <FactTile icon={Calendar} label="Schedule">
                  {course.startDate && course.expectedEndDate ? (
                    <>
                      {format(new Date(course.startDate), "MMM d")} –{" "}
                      {format(new Date(course.expectedEndDate), "MMM d, yyyy")}
                    </>
                  ) : (
                    "To be announced"
                  )}
                </FactTile>
              ) : null}

              {showPayment ? (
                <FactTile icon={Wallet} label="Payment">
                  {PAYMENT_STATUS_LABELS[enrollment.paymentStatus] ??
                    enrollment.paymentStatus}
                </FactTile>
              ) : null}

              {course.certificateEnabled ? (
                <FactTile icon={Award} label="Certificate">
                  {enrollment.certificate?.status === "ISSUED" ? (
                    <Link
                      href="/certificates"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      View certificate
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : enrollment.certificate?.status === "REVOKED" ? (
                    "Revoked"
                  ) : (
                    "After completion"
                  )}
                </FactTile>
              ) : null}

              <FactTile icon={FolderGit2} label="Project">
                {myProject ? (
                  <span className="flex items-center gap-1.5">
                    <Link
                      href={`/projects/${myProject.id}`}
                      className="text-primary hover:underline"
                    >
                      {myProject.title}
                    </Link>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        PROJECT_STATUS_STYLES[myProject.status],
                      )}
                    >
                      {myProject.status}
                    </span>
                  </span>
                ) : (
                  <Link
                    href={`/projects/new?enrollmentId=${enrollment.id}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Submit project
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </FactTile>
            </div>
          </div>
        </div>

        {isCompletionHistoryReadOnly ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800"
          >
            <LockKeyhole
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <p>
              This enrollment is complete. You can continue viewing its
              sessions, but your completion history is now read-only.
            </p>
          </div>
        ) : null}

        {/* Sessions is the primary reason a student opens this page — it
            belongs right after "where am I", ahead of reference content. */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Sessions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sessions appear here as they are released and become available for
              your course.
            </p>
          </div>
          <SessionList
            enrollmentId={enrollment.id}
            sessions={sessions}
            isReadOnly={isCompletionHistoryReadOnly}
          />
        </section>

        {/* Reference/marketing content the student already saw before
            enrolling — useful to have on hand, but secondary to the above. */}
        {hasAboutContent ? (
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">
              About this course
            </h2>
            {course.description ? (
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
            ) : null}

            {hasHighlights ? (
              <ul className="mt-4 space-y-2">
                {course.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {hasSkills ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}

            {hasPrerequisites ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prerequisites
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {course.prerequisites.join(" · ")}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </StudentOnlyRoute>
  );
}
