import type { UserRecord } from "@/features/users/usersTypes";

export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor:
    | UserRecord
    | { firstName: string; lastName: string; email?: never; id?: never; role?: never };
};

export type AuditPagination = {
  total: number;
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
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
  cursor?: string;
};
