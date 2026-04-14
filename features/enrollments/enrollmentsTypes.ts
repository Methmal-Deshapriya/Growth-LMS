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