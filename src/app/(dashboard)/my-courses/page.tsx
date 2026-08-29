"use client";

import React, { useState } from "react";
import { useGetMyEnrollmentsQuery } from "@/features/enrollments/enrollmentsApi";
import EnrollmentCard from "@/features/enrollments/components/EnrollmentCard";
import { Loader2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";

/**
 * My Courses Page
 *
 * Displays all courses the current student is enrolled in.
 */
export default function MyCoursesPage() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [history, setHistory] = useState<Array<string | undefined>>([]);
  const { data, isLoading, isError, isFetching } = useGetMyEnrollmentsQuery({
    limit: 20,
    cursor,
  });
  const enrollments = data?.enrollments ?? [];

  return (
    <StudentOnlyRoute description="Admins use the catalog and enrollment tools instead of the student classroom.">
      <div className="space-y-8 pb-20">
      {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Access all your enrolled courses and learning materials.
          </p>
        </div>

        {/* State Handling */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="font-medium text-muted-foreground">Loading your classroom...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-700">
              We couldn&apos;t load your courses. Please try refreshing the page.
            </p>
          </div>
        ) : enrollments.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {enrollments.map((enrollment) => (
                <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                disabled={history.length === 0 || isFetching}
                onClick={() => {
                  setCursor(history.at(-1));
                  setHistory((items) => items.slice(0, -1));
                }}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                disabled={!data?.pagination.hasMore || !data.pagination.nextCursor || isFetching}
                onClick={() => {
                  setHistory((items) => [...items, cursor]);
                  setCursor(data?.pagination.nextCursor ?? undefined);
                }}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-background">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              No enrollments yet
            </h2>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
              You are not enrolled in any courses yet. Explore our programs and
              start your tech career today!
            </p>
            <Button
              asChild
              className="h-12 rounded-xl bg-primary px-8 text-lg text-white hover:bg-primary/90"
            >
              <Link href="/bootcamps">Browse Bootcamps</Link>
            </Button>
          </div>
        )}
      </div>
    </StudentOnlyRoute>
  );
}
