import type { PublicCourseCard } from "@/features/catalog/catalogTypes";
import type { User } from "@/features/auth/authTypes";

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "NOT_REQUIRED" | "PENDING" | "PARTIAL" | "COMPLETED";
export type EnrollmentSource = "ADMIN" | "SELF";
export type CertificateStatus = "ISSUED" | "REVOKED";

export interface EnrollmentBatchSummary {
  id: string;
  name: string;
  code: string;
  startDate: string;
  expectedEndDate: string;
  timezone: string;
  status: string;
}

export interface EnrollmentCertificateSummary {
  id: string;
  certificateCode: string;
  status: CertificateStatus;
  issuedDate: string;
}

export interface MyEnrollment {
  enrolledAt: string;
  id: string;
  userId: string;
  courseId: string;
  batchId: string | null;
  source: EnrollmentSource;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  paymentCompletedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  course: PublicCourseCard;
  batch: EnrollmentBatchSummary | null;
  certificate: EnrollmentCertificateSummary | null;
}


export interface ClassRosterEntry extends MyEnrollment {
  user: User;
  enrolledBy?: User | null;
  enrolledByUserId?: string | null;
  externalPaymentReference?: string | null;
  paymentNote?: string | null;
}

export interface CreatePaidEnrollmentRequest {
  userId: string;
  paymentStatus?: Exclude<PaymentStatus, "NOT_REQUIRED">;
  externalPaymentReference?: string | null;
  paymentNote?: string | null;
}

export type UpdateEnrollmentRequest = {
  status?: EnrollmentStatus;
  paymentStatus?: Exclude<PaymentStatus, "NOT_REQUIRED">;
  externalPaymentReference?: string | null;
  paymentNote?: string | null;
};
export type EligibleStudent = Pick<User, "id" | "firstName" | "lastName" | "email">;
export type EligibleStudentsParams = { batchId: string; q?: string; limit?: number };

export interface BulkEnrollmentResult {
  results: Array<{
    userId: string;
    status: "CREATED" | "FAILED";
    enrollment?: ClassRosterEntry;
    code?: string;
    error?: string;
  }>;
  summary: { requested: number; created: number; failed: number };
}
