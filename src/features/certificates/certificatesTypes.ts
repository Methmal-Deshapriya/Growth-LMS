export type CertificateStatus = "ISSUED" | "REVOKED";

export type Certificate = {
  id: string;
  enrollmentId: string;
  certificateCode: string;
  studentName: string;
  courseName: string;
  description?: string | null;
  issuedDate: string;
  status: CertificateStatus;
  revokedAt?: string | null;
  revokedBy?: string | null;
  revocationReason?: string | null;
  certificateData: {
    skills: string[];
    studentEmail: string;
    courseSlug: string;
  };
  snapshotUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicCertificateVerification = {
  studentName: string;
  courseName: string;
  issuedDate: string;
  certificateCode: string;
  status: CertificateStatus;
  skills: string[];
};

export type IssueCertificateRequest = {
  description?: string | null;
  issuedDate?: string;
};

export type RevokeCertificateRequest = {
  revocationReason: string;
};

export type CertificateAdminPage = {
  certificates: Certificate[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
};

export type CertificateAdminParams = {
  q?: string;
  status?: CertificateStatus;
  limit?: number;
  cursor?: string;
};
