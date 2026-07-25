import type { Role } from "@/lib/constants";

export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type UsersPagination = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type UsersResponse = {
  users: UserRecord[];
  pagination: UsersPagination;
};

export type GetUsersParams = {
  role?: Role;
  limit?: number;
  offset?: number;
};
