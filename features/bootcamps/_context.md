# Bootcamps Feature — Context

## Purpose

Serves two audiences:
1. **Public** — anyone can browse published bootcamps (no auth required)
2. **Admin/Super-admin** — full CRUD, publish/unpublish management

Public detail view uses `slug`. Admin operations use `id`.

## API Endpoints

Base path: `/api/v1/bootcamps`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/bootcamps` | Public | All published bootcamps |
| GET | `/bootcamps/:slug` | Public | One published bootcamp by slug. 404 if unpublished. |
| GET | `/bootcamps/admin` | ADMIN, SUPER_ADMIN | All bootcamps including drafts |
| POST | `/bootcamps` | ADMIN, SUPER_ADMIN | Create bootcamp (starts as draft) |
| PATCH | `/bootcamps/:id` | ADMIN, SUPER_ADMIN | Update bootcamp fields |
| DELETE | `/bootcamps/:id` | ADMIN, SUPER_ADMIN | Delete bootcamp |
| PATCH | `/bootcamps/:id/publish` | ADMIN, SUPER_ADMIN | Publish bootcamp |
| PATCH | `/bootcamps/:id/unpublish` | ADMIN, SUPER_ADMIN | Unpublish bootcamp |

## Key Data Shapes

### Public Bootcamp
```json
{ "id": "uuid", "title": "...", "slug": "...", "description": "...", "price": 49.99, "createdAt": "..." }
```

### Admin Bootcamp (adds isPublished + updatedAt)
```json
{ "id": "uuid", "title": "...", "slug": "...", "description": "...", "price": 49.99, "isPublished": false, "createdAt": "...", "updatedAt": "..." }
```

### Create/Update Rules
- `price` must be a **number** (not a string)
- `slug` must be lowercase letters, numbers, dashes only (e.g. `full-stack-engineering`)
- `title` minimum 3 characters
- `description` is optional

## Important Note on Static vs API Data

The existing bootcamp detail page (`/bootcamps/[slug]`) currently uses **static data** from `data/courses/`.
The backend API only exposes: `title`, `slug`, `description`, `price`.
Richer sections (curriculum, intro video, certificate, for-who, pricing benefits) remain **static** until the backend is extended.

## Files

- `bootcampsApi.ts` — RTK Query endpoints (all public + admin)
- `bootcampsTypes.ts` — Bootcamp, BootcampAdmin, CreateBootcampRequest, UpdateBootcampRequest
- `components/public/` — Public-facing components
  - `BootcampCard.tsx` — Card shown in marketing section (uses static data for now)
  - `BootcampGrid.tsx` — Grid layout for bootcamp listing page (to be implemented)
  - `detail/` — Bootcamp detail page sections (Hero, CourseDescription, Curriculum, ForWho, Certificate, PriceDetails, IntroVideo)
- `components/admin/` — Admin management components (to be implemented)
  - `BootcampTable.tsx`
  - `BootcampForm.tsx`
  - `PublishToggle.tsx`