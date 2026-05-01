import type { UserRecord } from "@/features/users/usersTypes";

export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor: UserRecord | { name: string; email?: never; id?: never; role?: never };
};

export type AuditPagination = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type AuditLogsResponse = {
  logs: AuditLog[];
  pagination: AuditPagination;
};

export type AuditLogsParams = {
  action?: string;
  resourceType?: string;
  actorUserId?: string;
  entityId?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};