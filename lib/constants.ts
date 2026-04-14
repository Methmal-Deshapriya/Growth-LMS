export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const ROLES = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];