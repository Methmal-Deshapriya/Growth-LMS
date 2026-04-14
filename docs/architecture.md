# Foundry LMS Frontend Architecture

## 1. Purpose

This document defines the frontend architecture used in this project.

It also serves as the structural reference for the reusable Next.js frontend framework being standardized across future projects. It should be read together with:

- [frontend_dev_guide.md](/d:/Projects/foundry-lms/Growth-LMS/docs/frontend_dev_guide.md)
- [frontend_development_plan.md](/d:/Projects/foundry-lms/Growth-LMS/docs/frontend_development_plan.md)
- [ai_agent_guide.md](/d:/Projects/foundry-lms/Growth-LMS/docs/ai_agent_guide.md)

The architecture is designed to keep the frontend:

- modular
- scalable
- production-oriented
- predictable for humans and AI agents

---

## 2. Stack

| Concern | Tool |
|---------|------|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State and server cache | Redux Toolkit + RTK Query |
| UI primitives | shadcn/ui + Radix primitives |
| Animation | Motion |
| Smooth scroll | Lenis |

---

## 3. Architectural Principles

### 3.1 `app/` owns routing and layout composition

The `app/` directory is responsible for:

- route definitions
- route groups
- layouts
- page entry points
- route-level orchestration

It should not become the primary home for business logic.

### 3.2 `features/` owns domain logic

The `features/` directory is the main business layer.

Each feature should own its own:

- API definitions
- types
- feature-specific components
- feature-specific helpers
- optional forms, hooks, and mappers

### 3.3 `components/` owns shared UI

The `components/` directory is for reusable, mostly stateless UI and layout building blocks that can be shared safely across multiple app areas.

### 3.4 `store/` owns state infrastructure

The `store/` directory contains Redux and RTK Query wiring. It should stay centralized and intentional.

### 3.5 `lib/` owns cross-cutting helpers

The `lib/` directory contains shared utilities that do not belong to a single domain, such as constants, access helpers, API error helpers, route helpers, and formatters.

---

## 4. Folder Structure Framework

```txt
src/
  app/         Route groups, layouts, page entry points
  features/    Domain modules and business logic
  components/  Shared UI, layout, and presentational building blocks
  store/       Redux Toolkit and RTK Query setup
  lib/         Shared utilities, constants, access helpers, formatters
  data/        Static or temporary local content models when needed
```

### 4.1 Route groups

This project separates experiences by access model:

- `app/(public)/`
  public and guest-accessible routes

- `app/(auth)/`
  sign-in, sign-up, and guest-only auth flows

- `app/(dashboard)/`
  authenticated application routes for student, admin, and super-admin areas

### 4.2 Feature modules

Current feature modules include:

- `auth`
- `bootcamps`
- `enrollments`
- `users`
- `audit`

Typical feature contents may include:

- `_context.md`
- `<feature>Api.ts`
- `<feature>Types.ts`
- `components/`
- `forms/`
- `hooks/`
- `utils/`

### 4.3 Shared component groups

Current shared component groups include:

- `components/ui/`
- `components/layout/`
- `components/marketing/`

---

## 5. Current Repository Mapping

The current repository already reflects the framework clearly.

### 5.1 Current top-level `src/` structure

- `app`
- `components`
- `data`
- `features`
- `lib`
- `store`

### 5.2 Current meaning of those directories

- `app/` already separates public, auth, and dashboard route groups
- `features/` already contains the main business domains
- `store/` already centralizes Redux Toolkit and RTK Query
- `data/` currently supports temporary static bootcamp enrichment

---

## 6. Core Rules

### Rule 1. `store/baseApi.ts` is the single RTK Query origin

All feature API modules should extend the shared API root using `injectEndpoints`.

This gives the project:

- one shared RTK Query cache
- one place for credentials and base URL behavior
- one tag strategy

### Rule 2. `features/` owns domain logic and `app/` owns routing

Files under `app/` should stay thin.

They should mainly:

1. receive route params
2. render feature containers or feature components
3. compose layouts
4. coordinate route-level behavior

They should not become the main home for feature implementation.

### Rule 3. Shared components should remain domain-agnostic

If a component is tightly tied to one domain, it should normally stay inside that feature rather than moving into `components/`.

### Rule 4. `_context.md` is the feature quick-start document

When used, `_context.md` should explain:

- what the feature owns
- which endpoints it uses
- important state flows
- key UI entry points

This helps both human contributors and AI agents.

---

## 7. Data Flow

The intended data flow is:

```txt
Route file in app/
  -> uses feature hook or feature container
  -> feature API hook calls features/<name>/<name>Api.ts
  -> feature API extends store/baseApi.ts
  -> shared base query applies API base URL and credentials
  -> backend returns wrapped success or structured error
  -> transformResponse or shared parsing unwraps domain data
  -> feature component renders state
```

This keeps routing light and domain logic reusable.

---

## 8. API and State Strategy

### 8.1 RTK Query is the default API layer

The standard pattern is:

- one shared `baseApi`
- feature-level endpoint injection
- explicit tag usage
- shared credentials handling
- shared API base URL

### 8.2 Redux slices are for client state

Use slices for:

- auth metadata
- UI-only flags
- cross-screen client workflow state when needed

Do not duplicate RTK Query server data in slices unless there is a strong reason.

### 8.3 Avoid mixed networking styles

Do not introduce random direct `fetch()` or `axios` calls for standard feature work when the project already uses RTK Query.

---

## 9. Authentication and Access Model

This frontend is designed around cookie-based authentication.

### 9.1 Auth assumptions

- the backend manages the session cookie
- JavaScript cannot read the auth token directly
- the frontend should use `/auth/me` as the session source of truth
- authenticated requests must send credentials

### 9.2 Intended auth flow

1. the app mounts
2. auth bootstrap checks the current user
3. success stores the user in client auth state
4. `401` clears auth state and treats the user as logged out
5. role-based UI derives from `user.role`

### 9.3 Access model

| Area | Access |
|------|--------|
| `(public)` | anyone |
| `(auth)` | guests only |
| dashboard shared area | authenticated users |
| admin area | `ADMIN` and `SUPER_ADMIN` |
| super-admin-only actions | `SUPER_ADMIN` |

Frontend guards improve UX, but backend authorization remains the final authority.

---

## 10. Experience Layers

### 10.1 Public layer

Use for:

- marketing pages
- bootcamp discovery
- public bootcamp detail pages

### 10.2 Auth layer

Use for:

- sign-in
- sign-up
- guest-only access flows

### 10.3 Protected application layer

Use for:

- student pages
- admin management pages
- super-admin operational pages

This area should evolve toward an app-style shell with sidebar navigation.

---

## 11. Feature Development Pattern

When adding or expanding a feature:

1. create or extend `features/<name>/`
2. define or update `<name>Types.ts`
3. define or extend `<name>Api.ts`
4. add UI under `features/<name>/components/`
5. add forms or hooks only if needed
6. expose the experience through the correct route group in `app/`
7. update `_context.md` when the feature structure materially changes

---

## 12. Environment and Configuration

Current expected development variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

This should be defined in `.env.local` for local development.

The shared API layer should remain the main consumer of this configuration.

---

## 13. Relationship to Other Docs

- `frontend_dev_guide.md`
  backend API contract and integration guidance

- `frontend_development_plan.md`
  phased implementation roadmap

- `ai_agent_guide.md`
  execution rules and behavior guidance for AI agents

- `architecture.md`
  structural rules for organizing the frontend codebase

Together, these documents define:

- what the backend expects
- how the frontend is structured
- how the frontend should be built
- how contributors and AI agents should work within the framework
