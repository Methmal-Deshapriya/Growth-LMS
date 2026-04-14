# Users Feature — Context

## Purpose

Admin-level user management. Allows listing all users and promoting/demoting roles.
Only `SUPER_ADMIN` can promote or demote. `ADMIN` and `SUPER_ADMIN` can list users.

## API Endpoints

Base path: `/api/v1/users`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/users` | ADMIN, SUPER_ADMIN | Returns all users, newest first |
| PATCH | `/users/:id/promote` | SUPER_ADMIN | Promotes user to ADMIN |
| PATCH | `/users/:id/demote` | SUPER_ADMIN | Demotes ADMIN back to STUDENT |

## Business Rules

- Cannot promote someone already `ADMIN` or `SUPER_ADMIN` → 409 CONFLICT
- Cannot demote a `SUPER_ADMIN` → 403 FORBIDDEN
- Cannot demote a `STUDENT` (already lowest role) → 409 CONFLICT

## Key Data Shape

```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "STUDENT",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## UI Rules

- Show promote/demote buttons only to `SUPER_ADMIN` users
- Refetch user list after successful promote/demote (RTK Query invalidatesTags handles this)

## Files

- `usersApi.ts` — RTK Query endpoints (getUsers, promoteUser, demoteUser)
- `usersTypes.ts` — UserRecord type
- `components/UserTable.tsx` — User management table (to be implemented)
- `components/RoleBadge.tsx` — Role display badge (to be implemented)