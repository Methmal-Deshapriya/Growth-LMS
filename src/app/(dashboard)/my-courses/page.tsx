"use client";

import React from "react";
import { useGetMyEnrollmentsQuery } from "@/features/enrollments/enrollmentsApi";
import EnrollmentCard from "@/features/enrollments/components/EnrollmentCard";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";

/**
 * My Courses Page
 *
 * Displays all bootcamps the current student is enrolled in.
 */
export default function MyCoursesPage() {
  const { data: enrollments, isLoading, isError } = useGetMyEnrollmentsQuery();

  return (
    <StudentOnlyRoute description="Admins no longer need the student course workspace. Use the admin tools to manage bootcamps and enrollments instead.">
      <div className="space-y-8 pb-20">
      {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">
            Access all your enrolled bootcamps and learning materials.
          </p>
        </div>

        {/* State Handling */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-600" />
            <p className="font-medium text-gray-500">Loading your classroom...</p>
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
        ) : enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {enrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <BookOpen className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              No enrollments yet
            </h2>
            <p className="mx-auto mb-8 max-w-md text-gray-500">
              You are not enrolled in any bootcamps yet. Explore our programs and
              start your tech career today!
            </p>
            <Button
              asChild
              className="h-12 rounded-xl bg-blue-600 px-8 text-lg text-white hover:bg-blue-700"
            >
              <Link href="/bootcamps">Browse Bootcamps</Link>
            </Button>
          </div>
        )}
      </div>
    </StudentOnlyRoute>
  );
}
