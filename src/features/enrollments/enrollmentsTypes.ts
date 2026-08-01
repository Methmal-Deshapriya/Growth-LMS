import type { Bootcamp } from "@/features/bootcamps/bootcampsTypes";
import type { User } from "@/features/auth/authTypes";

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PARTIAL" | "COMPLETED";

export type MyEnrollment = {
  enrolledAt: string | number | Date;
  id: string;
  userId: string;
  bootcampId: string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  paymentCompletedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  bootcamp: Bootcamp;
};

export type ClassRosterEntry = Omit<MyEnrollment, "bootcamp"> & {
  user: User;
};

export type CreateEnrollmentRequest = {
  userId: string;
  bootcampId: string;
  paymentStatus?: PaymentStatus;
};

export type UpdateEnrollmentRequest = {
  status?: EnrollmentStatus;
  paymentStatus?: PaymentStatus;
  paymentCompletedAt?: string | null;
  completedAt?: string | null;
};

export type EligibleStudent = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type EligibleStudentsParams = {
  bootcampId: string;
  q?: string;
  limit?: number;
};
