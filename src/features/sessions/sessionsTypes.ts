export type SessionReusePolicy = "SINGLE_COURSE" | "REUSABLE";
export type SessionStatus = "DRAFT" | "READY" | "ARCHIVED";

export interface SessionContent {
  title: string;
  description?: string | null;
  recordingUrl?: string | null;
  materialUrl?: string | null;
  quizUrl?: string | null;
  feedbackUrl?: string | null;
  durationMinutes?: number | null;
  reusePolicy: SessionReusePolicy;
}

export interface SessionUsageCourse {
  courseSessionId: string;
  courseId: string;
  courseTitle: string;
  orderIndex: number | null;
  retiredAt: string | null;
  batchCount: number;
}

export interface LibrarySession extends SessionContent {
  id: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  usage: {
    courseCount: number;
    activeCourseCount: number;
    batchCount: number;
    courses: SessionUsageCourse[];
  };
}

export type CreateSessionRequest = SessionContent & {
  status?: "DRAFT" | "READY";
};
export type UpdateSessionRequest = Partial<CreateSessionRequest>;

export interface CourseSession {
  id: string;
  courseId: string;
  orderIndex: number | null;
  retiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  session: Omit<LibrarySession, "usage">;
  usage: {
    batchCount: number;
    completionCount: number;
    batches: Array<{
      batchSessionId: string;
      batchId: string;
      batchName: string;
      batchCode: string;
      batchStatus:
        | "DRAFT"
        | "ENROLLING"
        | "ACTIVE"
        | "COMPLETED"
        | "CANCELLED"
        | "ARCHIVED";
      isReleased: boolean;
      availableAt: string | null;
    }>;
  };
}

export interface CurriculumResponse {
  course: {
    id: string;
    title: string;
    status: string;
    category: { id: string; title: string; serviceType: string };
  };
  delivery: {
    serviceType: string;
    deliveryMode: "COHORT" | "SELF_PACED";
    immediateAvailability: boolean;
    affectedLearnerCount: number;
  };
  curriculum: CourseSession[];
}

export interface EnrollmentProgress {
  enrollmentId: string;
  courseId: string;
  completedCount: number;
  availableSessionCount: number;
  progressPercent: number;
}

export interface ClassroomSession {
  courseSessionId: string;
  orderIndex: number | null;
  title: string;
  description: string | null;
  recordingUrl: string | null;
  materialUrl: string | null;
  quizUrl: string | null;
  feedbackUrl: string | null;
  durationMinutes: number | null;
  sessionStatus: SessionStatus;
  availableAt: string | null;
  completed: boolean;
  completedAt: string | null;
}

export interface ClassroomResponse {
  enrollment: {
    id: string;
    status: string;
    source: "ADMIN" | "SELF";
    deliveryMode: "COHORT" | "SELF_PACED";
    course: PublicCourseCard;
    batch: {
      id: string;
      name: string;
      code: string;
      status: string;
      startDate: string;
      expectedEndDate: string;
      timezone: string;
    } | null;
  };
  sessions: ClassroomSession[];
  progress: EnrollmentProgress;
}

export interface SessionCompletionResult {
  id: string;
  enrollmentId: string;
  courseSessionId: string;
  courseId: string;
  completedAt: string;
  created: boolean;
}
import type { PublicCourseCard } from "@/features/catalog/catalogTypes";
