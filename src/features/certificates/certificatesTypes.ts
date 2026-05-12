export type CertificateStatus = "ISSUED" | "REVOKED";

export type Certificate = {
  id: string;
  enrollmentId: string;
  certificateCode: string;
  studentName: string;
  bootcampName: string;
  description?: string | null;
  issuedDate: string;
  status: CertificateStatus;
  revokedAt?: string | null;
  revokedBy?: string | null;
  revocationReason?: string | null;
  certificateData: {
    skills: string[];
    studentEmail: string;
    bootcampSlug: string;
  };
  snapshotUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicCertificateVerification = {
  studentName: string;
  bootcampName: string;
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
