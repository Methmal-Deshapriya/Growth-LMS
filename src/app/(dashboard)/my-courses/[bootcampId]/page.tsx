"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  useGetBootcampSessionsQuery,
  useGetEnrollmentProgressQuery,
} from "@/features/sessions/sessionsApi";
import { useGetMyEnrollmentsQuery } from "@/features/enrollments/enrollmentsApi";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Assuming a progress bar exists or I'll build a simple one
import SessionList from "@/features/sessions/components/SessionList";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";

/**
 * Bootcamp Learning Page
 *
 * The main learning interface for students to watch recordings,
 * access materials, and track progress.
 */
export default function LearningPage() {
  const params = useParams();
  const bootcampId = params.bootcampId as string;

  // 1. Fetch all my enrollments to find the enrollment ID for this bootcamp
  const { data: enrollments, isLoading: isEnrollmentsLoading } =
    useGetMyEnrollmentsQuery();

  const currentEnrollment = enrollments?.find(
    (e) => e.bootcamp?.id === bootcampId,
  );
  const enrollmentId = currentEnrollment?.id;

  // 2. Fetch Sessions
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    isError: isSessionsError,
  } = useGetBootcampSessionsQuery(bootcampId);

  // 3. Fetch Progress (Skip until we have enrollmentId)
  const { data: progress } =
    useGetEnrollmentProgressQuery(enrollmentId || "", {
      skip: !enrollmentId,
    });

  const isLoading = isEnrollmentsLoading || isSessionsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Preparing your classroom...</p>
      </div>
    );
  }

  if (isSessionsError || !currentEnrollment) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
        <p className="text-red-700 mb-6">
          We couldn&apos;t load this course. Please ensure you are enrolled and
          try again.
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

  return (
    <StudentOnlyRoute description="Admins no longer need direct access to the student learning classroom. Please manage sessions and enrollments from the admin area.">
      <div className="space-y-8 pb-20">
      {/* Breadcrumbs / Back */}
        <div className="flex items-center gap-4">
          <Link
            href="/my-courses"
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentEnrollment.bootcamp.title}
          </h1>
        </div>

      {/* Progress Overview Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-1">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Course Completion
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {progress?.progressPercent || 0}%
                </p>
              </div>
              <Progress
                value={progress?.progressPercent || 0}
                className="h-2.5"
              />
              <p className="mt-2 text-xs text-gray-500">
                {progress?.completedCount || 0} of{" "}
                {progress?.totalPublishedSessions || 0} sessions completed
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Future: "Continue Learning" button that jumps to next incomplete session */}
            </div>
          </div>
        </div>

        {/* Sessions List Component */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Curriculum</h2>
            </div>

            <SessionList
              sessions={sessions || []}
            />
          </div>
        </div>
      </div>
    </StudentOnlyRoute>
  );
}
