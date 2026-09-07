export type RecentEnrollmentSummary = {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  updatedAt: string;
  courseTitle: string | null;
  intakeCode: string | null;
};

export type StudentDashboardSummary = {
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  recentEnrollments: RecentEnrollmentSummary[];
};

export type AdminDashboardSummary = {
  totalStudents: number;
  totalActiveEnrollments: number;
  pendingEnrollmentRequests: number;
  totalCertificatesIssued: number;
};
