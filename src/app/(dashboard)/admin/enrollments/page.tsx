"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Admin Enrollments Page
 * 
 * Provides tools for managing student access to courses.
 */
export default function AdminEnrollmentsPage() {
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Enrollment Operations</h1>
        <p className="text-muted-foreground mt-1">
          Paid enrollment is managed inside the exact course batch the learner is joining.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8"><h2 className="text-xl font-bold">Choose Course → Batch → Roster</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Open a Bootcamp or PreTech course, choose its intake, then search verified students and record their external payment evidence. Free Learning students enroll themselves and do not appear in this paid operation.</p><Button asChild className="mt-6"><Link href="/admin/catalog/courses">Open course catalog</Link></Button></div>
    </div>
  );
}
