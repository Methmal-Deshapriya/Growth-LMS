"use client";

import { useAppSelector } from "@/store/hooks";
import { selectAuthRole, selectAuthUser } from "@/features/auth/authSelectors";
import { isStudent } from "@/lib/access";
import EnrollmentIntentHandler from "@/features/enrollments/components/EnrollmentIntentHandler";
import EnrollmentRequestIntentHandler from "@/features/enrollments/components/EnrollmentRequestIntentHandler";
import StudentDashboard from "@/features/dashboard/components/StudentDashboard";
import AdminDashboard from "@/features/dashboard/components/AdminDashboard";

/**
 * Two genuinely separate dashboards sharing one route: students get their
 * own learning-progress overview, admins/super-admins get a platform-wide
 * operations overview. Which one renders is entirely determined by role —
 * a student can never see the admin view and vice versa.
 */
export default function DashboardPage() {
  const role = useAppSelector(selectAuthRole);
  const user = useAppSelector(selectAuthUser);

  return (
    <>
      <EnrollmentIntentHandler />
      <EnrollmentRequestIntentHandler />
      {isStudent(role) ? (
        <StudentDashboard firstName={user?.firstName} />
      ) : (
        <AdminDashboard />
      )}
    </>
  );
}
