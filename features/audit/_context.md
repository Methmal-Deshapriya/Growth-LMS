# Audit Feature — Context

## Purpose

Read-only access to the system audit log. Only `SUPER_ADMIN` can view these logs.
The frontend never writes audit logs — they are created automatically by backend services.

## API Endpoints

Base path: `/api/v1/audit`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/audit/logs` | SUPER_ADMIN | Returns paginated, filterable audit logs |

## Query Parameters

| Param | Description |
|-------|-------------|
| `action` | Filter by action type (e.g. `USER_PROMOTED`) |
| `resourceType` | Filter by entity type — frontend sends `resourceType`, backend maps to `entityType` |
| `actorUserId` | Filter by who performed the action |
| `entityId` | Filter by affected entity ID |
| `from` | ISO date string — start of range |
| `to` | ISO date string — end of range |
| `limit` | Page size (default backend behaviour) |
| `offset` | Pagination offset |

Example: `GET /api/v1/audit/logs?action=USER_PROMOTED&resourceType=USER&limit=20&offset=0`

## Response Shape

```json
{
  "logs": [
    {
      "id": "audit-uuid",
      "action": "USER_PROMOTED",
      "entityType": "USER",
      "entityId": "user-uuid",
      "description": "User jane@example.com promoted to ADMIN",
      "metadata": { "oldRole": "STUDENT", "newRole": "ADMIN" },
      "createdAt": "...",
      "actor": { "id": "...", "name": "Root User", "email": "root@example.com", "role": "SUPER_ADMIN", "createdAt": "...", "updatedAt": "..." }
    }
  ],
  "pagination": {
    "total": 123,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## UI Notes

- Use `logs` array for table rows
- Use `pagination.hasMore` to show load-more or next-page controls
- Send ISO-compatible date strings for `from` and `to`

## Files

- `auditApi.ts` — RTK Query endpoint (getAuditLogs)
- `auditTypes.ts` — AuditLog, AuditPagination, AuditLogsResponse, AuditLogsParams
- `components/AuditLogTable.tsx` — Log table with filters and pagination (to be implemented)