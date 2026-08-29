"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Loader2, Users } from "lucide-react";
import { useGetClassroomQuery } from "@/features/sessions/sessionsApi";
import SessionList from "@/features/sessions/components/SessionList";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getApiErrorMessage } from "@/lib/api";

export default function LearningPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const { data: classroom, isLoading, error } = useGetClassroomQuery(enrollmentId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="font-medium text-muted-foreground">Preparing your classroom...</p>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
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
  const isCompletionHistoryReadOnly = enrollment.status === "COMPLETED";

  return (
    <StudentOnlyRoute description="Admins manage course delivery and enrollments from the admin area.">
      <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <Link
            href="/my-courses"
            aria-label="Back to My Courses"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {enrollment.course.title}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              {enrollment.course.instanceKind === "SEASONAL" ? (
                <>
                  <Users className="h-4 w-4" />
                  {enrollment.course.intakeKey} ({enrollment.course.code})
                </>
              ) : (
                "Self-paced Free Learning"
              )}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Course Completion</p>
              <p className="text-sm font-bold text-primary">{progress.progressPercent}%</p>
            </div>
            <Progress value={progress.progressPercent} className="h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {progress.completedCount} of {progress.availableSessionCount} available sessions completed
            </p>
          </div>
        </div>

        {isCompletionHistoryReadOnly ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800"
          >
            <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              This enrollment is complete. You can continue viewing its sessions,
              but your completion history is now read-only.
            </p>
          </div>
        ) : null}

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Sessions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sessions appear here as they are released and become available for your course.
            </p>
          </div>
          <SessionList
            enrollmentId={enrollment.id}
            sessions={sessions}
            isReadOnly={isCompletionHistoryReadOnly}
          />
        </section>
      </div>
    </StudentOnlyRoute>
  );
}
