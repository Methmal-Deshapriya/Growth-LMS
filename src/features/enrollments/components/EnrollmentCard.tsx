"use client";

import React from "react";
import Link from "next/link";
import { MyEnrollment } from "../enrollmentsTypes";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface EnrollmentCardProps {
  enrollment: MyEnrollment;
}

/**
 * EnrollmentCard Component
 *
 * Displays an active course enrollment for a student.
 */
export default function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const { course } = enrollment;

  // Format the enrollment date (April 14, 2026 format)
  const formattedDate = format(
    new Date(enrollment.enrolledAt),
    "MMMM dd, yyyy",
  );

  return (
    <div className="group bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Visual Side */}
        <div className="md:w-48 bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center p-6 text-white group-hover:from-indigo-600 group-hover:to-blue-700 transition-colors">
          <BookOpen className="h-12 w-12 opacity-30" />
        </div>

        {/* Content Side */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
              <Calendar className="h-3.5 w-3.5" />
              Enrolled on {formattedDate}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>

            <p className="text-foreground text-sm line-clamp-2 mb-4">
              {course.summary}
            </p>
          </div>

          <div className="flex items-center justify-end pt-4">
            <Button
              asChild
              className="bg-gray-900 hover:bg-black text-white rounded-xl px-6"
            >
              <Link href={`/my-courses/${course.id}`}>
                Go to Course
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
