"use client";

import React from "react";
import ManualEnrollmentForm from "@/features/enrollments/components/ManualEnrollmentForm";

/**
 * Admin Enrollments Page
 * 
 * Provides tools for managing student access to bootcamps.
 */
export default function AdminEnrollmentsPage() {
  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Enrollment Operations</h1>
        <p className="text-muted-foreground mt-1">
          Manually grant students access to professional programs.
        </p>
      </div>

      <ManualEnrollmentForm />
      
      <div className="mt-12 bg-primary/10 border border-primary/20 rounded-2xl p-8">
        <h4 className="font-bold text-primary mb-2">Pro Tip</h4>
        <p className="text-primary text-sm leading-relaxed">
          In version 1, students cannot self-enroll. Once you confirm their payment receipt (via email or message), 
          use this form to grant them instant access. They will see the course in their &quot;My Courses&quot; dashboard immediately.
        </p>
      </div>
    </div>
  );
}
