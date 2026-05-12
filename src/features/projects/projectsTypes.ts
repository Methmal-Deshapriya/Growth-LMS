export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

export type StudentProject = {
  id: string;
  userId: string;
  bootcampId: string;
  enrollmentId: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  technologies: string[];
  status: ProjectStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  adminFeedback?: string | null;
  isPublic: boolean;
  displayOrder: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  // Included fields
  user?: {
    name: string;
  };
  bootcamp?: {
    title: string;
  };
};

export type SubmitProjectRequest = {
  bootcampId: string;
  enrollmentId: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  technologies?: string[];
  isPublic?: boolean;
};

export type UpdateProjectRequest = Partial<Omit<SubmitProjectRequest, "bootcampId" | "enrollmentId">>;

export type ReviewProjectRequest = {
  status: ProjectStatus;
  adminFeedback?: string | null;
};
