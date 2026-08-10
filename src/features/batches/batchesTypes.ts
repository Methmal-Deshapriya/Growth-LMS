import type { CourseSession } from "@/features/sessions/sessionsTypes";
import type { LearningServiceType } from "@/features/catalog/catalogTypes";

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
  completionReadiness?: CompletionReadiness;
  course: {
    id: string;
    title: string;
    certificateEnabled: boolean;
    category: { id: string; title: string; serviceType: LearningServiceType };
  };
}

export interface BatchInput {
  name: string;
  code: string;
  startDate: string;
  expectedEndDate: string;
  timezone?: string;
  capacity?: number | null;
}

export interface BatchSession {
  id: string | null;
  batchId: string;
  courseSessionId: string;
  orderIndex: number;
  isReleased: boolean;
  availableAt: string | null;
  inherited: boolean;
  source: "ACTIVE_CURRICULUM" | "RETAINED_HISTORY";
  state: "UNRELEASED" | "WITHDRAWN" | "SCHEDULED" | "RELEASED";
  completionCount: number;
  courseSession: Omit<CourseSession, "usage">;
}

export interface CompletionReadiness {
  curriculum: { total: number; releasedAndAvailable: number; ready: boolean };
  enrollments: { total: number; completed: number; ready: boolean };
  certificates: {
    required: boolean;
    enabled: boolean;
    issued: number;
    ready: boolean;
  };
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
  completionReadiness: CompletionReadiness;
}
