"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Calendar, LockKeyhole, Users } from "lucide-react";
import type { MyEnrollment } from "../enrollmentsTypes";
import { Button } from "@/components/ui/button";

interface EnrollmentCardProps {
  enrollment: MyEnrollment;
}

const accessibleBatchStatuses = new Set(["ACTIVE", "COMPLETED", "ARCHIVED"]);

function getAccessMessage(enrollment: MyEnrollment) {
  if (enrollment.status === "CANCELLED") {
    return "This enrollment was cancelled. Contact support if this is unexpected.";
  }
  if (enrollment.source === "ADMIN" && enrollment.paymentStatus !== "COMPLETED") {
    return "Classroom access opens after an admin confirms the completed payment.";
  }
  if (
    enrollment.batch &&
    !accessibleBatchStatuses.has(enrollment.batch.status)
  ) {
    return "Your classroom opens when this batch becomes active.";
  }
  return null;
}

export default function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const { course, batch } = enrollment;
  const accessMessage = getAccessMessage(enrollment);
  const isAccessible = accessMessage === null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-center bg-linear-to-br from-indigo-500 to-blue-600 p-6 text-white transition-colors group-hover:from-indigo-600 group-hover:to-blue-700 md:w-48">
          <BookOpen className="h-12 w-12 opacity-30" />
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Enrolled {format(new Date(enrollment.enrolledAt), "MMMM dd, yyyy")}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-1">
                {batch ? "Batch learning" : "Self-paced"}
              </span>
            </div>

            <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
              {course.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-foreground">
              {course.summary}
            </p>

            {batch ? (
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Users className="h-4 w-4" />
                  {batch.name} ({batch.code})
                </span>
                <span>
                  {format(new Date(batch.startDate), "MMM d, yyyy")} - {format(new Date(batch.expectedEndDate), "MMM d, yyyy")}
                </span>
              </div>
            ) : null}

            {accessMessage ? (
              <p className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
                {accessMessage}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-end pt-4">
            {isAccessible ? (
              <Button asChild className="rounded-xl bg-gray-900 px-6 text-white hover:bg-black">
                <Link href={`/my-courses/${enrollment.id}`}>
                  Open Classroom
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button disabled className="rounded-xl px-6">
                Classroom Locked
                <LockKeyhole className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
