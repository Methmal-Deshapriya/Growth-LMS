import type { Role } from "@/lib/constants";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
