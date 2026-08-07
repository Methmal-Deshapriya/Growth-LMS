import type { CourseSession } from "@/features/sessions/sessionsTypes";

export type BatchStatus =
  | "DRAFT"
  | "ENROLLING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export interface Batch {
  id: string;
  courseId: string;
  name: string;
  code: string;
  startDate: string;
  expectedEndDate: string;
  timezone: string;
  capacity: number | null;
  status: BatchStatus;
  sessionCount: number;
  enrollmentCount: number;
  course: { id: string; title: string; category: { serviceType: string } };
}

export interface BatchInput {
  name: string;
  code: string;
  startDate: string;
  expectedEndDate: string;
  timezone?: string;
  capacity?: number | null;
  initializeCurriculum?: boolean;
}

export interface BatchSession {
  id: string;
  batchId: string;
  courseSessionId: string;
  orderIndex: number;
  isReleased: boolean;
  availableAt: string | null;
  state: "HIDDEN" | "SCHEDULED" | "AVAILABLE";
  completionCount: number;
  courseSession: Omit<CourseSession, "usage">;
}

export interface BatchSessionsResponse {
  batch: {
    id: string;
    name: string;
    code: string;
    status: BatchStatus;
    courseId: string;
    courseTitle: string;
  };
  sessions: BatchSession[];
}
