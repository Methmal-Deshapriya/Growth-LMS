# Enrollments Feature — Context

## Purpose

Manages course access for students and enrollment creation for admins.
All enrollment routes require **authentication** (`authenticate` middleware applied to entire module).

## API Endpoints

Base path: `/api/v1/enrollments`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/enrollments/my` | Any authenticated user | Returns current user's enrollments with bootcamp data |
| POST | `/enrollments` | ADMIN, SUPER_ADMIN | Manually enroll a student into a bootcamp |
| GET | `/enrollments/bootcamp/:bootcampId` | ADMIN, SUPER_ADMIN | Returns all students enrolled in a specific bootcamp |

## Key Data Shapes

### My Enrollments (GET /enrollments/my)
```json
[
  {
    "id": "enrollment-uuid",
    "enrolledAt": "...",
    "bootcamp": { "id": "...", "title": "...", "slug": "...", "description": "...", "price": 49.99, "createdAt": "..." }
  }
]
```

### Create Enrollment (POST /enrollments)
```json
// Request body
{ "userId": "student-uuid", "bootcampId": "bootcamp-uuid" }

// Both must be valid UUIDs. Duplicate enrollment returns 409 CONFLICT.
```

### Bootcamp Roster (GET /enrollments/bootcamp/:bootcampId)
```json
[
  {
    "id": "enrollment-uuid",
    "enrolledAt": "...",
    "student": { "id": "...", "name": "...", "email": "...", "role": "STUDENT", "createdAt": "...", "updatedAt": "..." }
  }
]
```

## Files

- `enrollmentsApi.ts` — RTK Query endpoints
- `enrollmentsTypes.ts` — MyEnrollment, ClassRosterEntry, CreateEnrollmentRequest
- `components/EnrollmentList.tsx` — Student's enrolled courses list (to be implemented)
- `components/ClassRoster.tsx` — Admin view of students per bootcamp (to be implemented)