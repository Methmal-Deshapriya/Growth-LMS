import type { Role } from "@/features/auth/authTypes";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};