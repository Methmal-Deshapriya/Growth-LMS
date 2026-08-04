export type Session = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  recordingUrl?: string | null;
  materialUrl?: string | null;
  quizUrl?: string | null;
  feedbackUrl?: string | null;
  durationMinutes?: number | null;
  isPublished: boolean;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateSessionRequest = {
  title: string;
  description?: string | null;
  orderIndex: number;
  recordingUrl?: string | null;
  materialUrl?: string | null;
  quizUrl?: string | null;
  feedbackUrl?: string | null;
  durationMinutes?: number | null;
  isPublished?: boolean;
};

export type UpdateSessionRequest = Partial<CreateSessionRequest>;

export type ReorderSessionsRequest = {
  sessions: {
    id: string;
    orderIndex: number;
  }[];
};

export type EnrollmentProgress = {
  enrollmentId: string;
  courseId: string;
  completedCount: number;
  totalPublishedSessions: number;
  progressPercent: number;
};
