import type { Bootcamp } from "@/features/bootcamps/bootcampsTypes";
import type { User } from "@/features/auth/authTypes";

export type MyEnrollment = {
  id: string;
  enrolledAt: string;
  bootcamp: Bootcamp;
};

export type ClassRosterEntry = {
  id: string;
  enrolledAt: string;
  student: User;
};

export type CreateEnrollmentRequest = {
  userId: string;
  bootcampId: string;
};

export type EligibleStudent = {
  id: string;
  name: string;
  email: string;
};

export type EligibleStudentsParams = {
  bootcampId: string;
  q?: string;
  limit?: number;
};
