import type { PublicCourseCard } from "@/features/catalog/catalogTypes";

export type SessionStatus = "DRAFT" | "READY" | "ARCHIVED";
export type CourseSessionDeliveryStatus =
  | "UNRELEASED"
  | "SCHEDULED"
  | "RELEASED"
  | "WITHDRAWN";

export interface SessionContent {
  title: string;
  description?: string | null;
  recordingUrl?: string | null;
  materialUrl?: string | null;
  quizUrl?: string | null;
  feedbackUrl?: string | null;
  durationMinutes?: number | null;
}

export interface SessionUsageCourse {
  courseSessionId: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  courseGroupId: string;
  orderIndex: number | null;
  retiredAt: string | null;
  deliveryStatus: CourseSessionDeliveryStatus;
}

export interface LibrarySession extends SessionContent {
  id: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  usage: {
    courseCount: number;
    activeCourseCount: number;
    courseGroupCount: number;
    courses: SessionUsageCourse[];
  };
}

export type CreateSessionRequest = SessionContent & { status?: "DRAFT" | "READY" };
export type UpdateSessionRequest = Partial<CreateSessionRequest>;

export interface CourseSession {
  id: string;
  courseId: string;
  orderIndex: number | null;
  deliveryStatus: CourseSessionDeliveryStatus;
  availableAt: string | null;
  firstReleasedAt: string | null;
  retiredAt: string | null;
  historicalOrderIndex: number | null;
  session: Omit<LibrarySession, "usage">;
  usage: { completionCount: number };
}

export interface CurriculumResponse {
  course: {
    id: string;
    title: string;
    code: string;
    status: string;
    accessType: "FREE" | "PAID";
    category: { id: string; title: string; serviceType: string };
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
  deliveryStatus: CourseSessionDeliveryStatus;
  availableAt: string | null;
  retired: boolean;
  completed: boolean;
  completedAt: string | null;
}

export interface ClassroomResponse {
  enrollment: {
    id: string;
    status: string;
    source: "ADMIN" | "SELF";
    deliveryMode: "PAID" | "FREE";
    course: PublicCourseCard & {
      intakeKey: string;
      code: string;
      instanceKind: "SEASONAL" | "EVERGREEN";
    };
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
