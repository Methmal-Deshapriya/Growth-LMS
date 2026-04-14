# Foundry LMS Frontend Development Plan

## 1. Purpose

This document is the execution plan for building the Foundry LMS frontend against the existing backend API.

It is based on:

- the backend contract in [frontend_dev_guide.md](/d:/Projects/foundry-lms/Growth-LMS/docs/frontend_dev_guide.md)
- the current Next.js codebase state
- the confirmed product decisions from the project owner

This plan is intentionally production-oriented. It assumes we want a frontend that is:

- modular
- secure
- maintainable
- role-aware
- API-first
- ready for enterprise-style growth

It also reflects the technical direction already chosen:

- Next.js App Router
- Redux Toolkit
- RTK Query for server communication
- cookie-based authentication with backend-managed session
- toast + inline form errors
- one smart `/dashboard` that adapts by role
- app-style dashboard shell with sidebar for protected areas
- hybrid MVP bootcamp detail page

---

## 2. Confirmed Product Decisions

These are already decided and should be treated as implementation constraints:

1. Bootcamp detail page should be a hybrid MVP.
   Live API fields should drive core content like title, description, and price, while richer sections can remain temporarily static where available.

2. `/dashboard` should be one smart role-based dashboard.
   The page should adapt based on the authenticated user role instead of splitting into separate dashboard roots.

3. Admin and super-admin areas should use an app-style dashboard shell.
   That means sidebar navigation, authenticated layout, and task-oriented management screens rather than public marketing-style pages.

4. Public self-registration should remain enabled.
   The frontend should support the current backend behavior for open user registration.

5. Feedback UX should use toast notifications and inline field errors together.
   Inline errors are for field-level clarity, and toasts are for success/error events at the action level.

---

## 3. Backend Integration Constraints

These rules shape all frontend implementation:

### 3.1 Authentication

- Auth is cookie-based, not token-in-localStorage.
- The frontend cannot read the token directly.
- The backend sets the `token` cookie on login and registration.
- All API requests must send credentials.
- `GET /auth/me` is the source of truth for session state.

### 3.2 Authorization

- Roles are `STUDENT`, `ADMIN`, and `SUPER_ADMIN`.
- The frontend should hide unauthorized UI for better UX.
- The backend remains the final authority for access control.

### 3.3 Bootcamp model

- Public bootcamp detail uses `slug`.
- Admin bootcamp management uses `id`.
- Rich content like curriculum, FAQs, instructors, and media is not yet provided by the backend.
- The detail page must therefore be hybrid until the backend content model expands.

### 3.4 Enrollment model

- Students do not self-enroll through the current backend.
- Enrollment creation is admin-only.
- Student course access must be driven by `GET /enrollments/my`.

### 3.5 Error handling

- The backend returns a structured error shape with `error`, `code`, `field`, and optional `details`.
- Forms should map `field` to inline errors where present.
- Global failures should also surface through toast notifications.

---

## 4. Current Frontend State Assessment

This is the current codebase status as of April 14, 2026.

### 4.1 Strong foundations already present

- Redux Toolkit store exists in [store.ts](/d:/Projects/foundry-lms/Growth-LMS/src/store/store.ts).
- RTK Query base API exists in [baseApi.ts](/d:/Projects/foundry-lms/Growth-LMS/src/store/baseApi.ts).
- Store provider is already wired in [src/app/layout.tsx](/d:/Projects/foundry-lms/Growth-LMS/src/app/layout.tsx).
- Feature folders already exist for:
  - auth
  - bootcamps
  - enrollments
  - users
  - audit
- Core RTK Query endpoint files already exist for those modules.
- Role constants are already defined in [constants.ts](/d:/Projects/foundry-lms/Growth-LMS/src/lib/constants.ts).

### 4.2 What is partially implemented

- RTK Query endpoints cover the backend API at a basic level.
- Auth slice exists, but session hydration and route protection are not yet implemented.
- Public course detail page exists visually, but still reads from static local course data.

### 4.3 What is still missing

- Sign-in page is still a placeholder.
- Sign-up page is still a placeholder.
- Public bootcamp listing page is still a placeholder.
- Navbar is not connected to auth state or real course navigation.
- Dashboard layout is only a comment stub right now.
- No actual protected dashboard pages are built yet.
- No admin shell exists yet.
- No student, admin, or super-admin operational screens are built yet.
- No centralized error normalization layer exists yet.
- No form architecture exists yet for production-grade validation and submission handling.

### 4.4 Architectural gaps to close before scaling

- The current RTK Query layer assumes success responses but does not yet normalize backend errors in a reusable way.
- There is no app-wide auth bootstrap flow using `/auth/me`.
- There are no shared authorization helpers for route and UI guards.
- There is no consistent application shell split between public and protected experiences.
- There is no documented frontend folder convention yet for scalable module development.

---

## 5. Target Frontend Architecture

The frontend should evolve toward the following structure.

### 5.1 App layers

- `app/`
  Route composition, layouts, and page-level entry points

- `features/`
  Domain modules containing API hooks, types, feature components, forms, and local helpers

- `components/`
  Reusable presentational UI and layout primitives

- `store/`
  Redux store, base API, and global state configuration

- `lib/`
  Cross-cutting utilities such as route helpers, error mapping, formatting, auth helpers, and guards

### 5.2 State strategy

- Use RTK Query for server state and API caching
- Use Redux slice state only for true client state such as auth status metadata and UI-only flags
- Keep page components thin
- Put integration logic close to feature modules

### 5.3 Route strategy

- Public routes stay under the existing public layout
- Auth routes remain isolated from both marketing and dashboard shells
- Protected areas move into an authenticated app shell with sidebar navigation
- `/dashboard` becomes the smart landing page after auth

### 5.4 Error and UX strategy

- Normalize backend API errors into a consistent frontend shape
- Show inline field errors for validation issues
- Show toast messages for mutation outcomes
- Provide loading, empty, and error states for all data screens

### 5.5 Security strategy

- Never store auth tokens in localStorage
- Always call the backend with credentials
- Treat `/auth/me` as the canonical session check
- Block protected UI by role in the frontend for UX
- Still rely on backend responses as the true permission guard

---

## 6. Delivery Principles

We should build in vertical slices, not all at once.

Each phase should:

- produce a working increment
- reduce integration risk early
- keep UI and API contracts aligned
- leave the codebase cleaner than before

Every phase should include:

- implementation
- basic validation
- error handling
- loading and empty states
- route/access considerations
- a short documentation update if new patterns are introduced

---

## 7. Development Phases

## Phase 0. Frontend Foundation Hardening

### Goal

Stabilize the project foundation so later feature work is fast, consistent, and safe.

### Why this phase comes first

Even though RTK Query and Redux already exist, they are not yet production-ready as a frontend platform. We need a reliable base before connecting major user flows.

### Deliverables

- Verify and finalize environment variable usage for `NEXT_PUBLIC_API_BASE_URL`
- Add a reusable API response/error normalization strategy for RTK Query
- Add shared TypeScript types for common API success/error shapes
- Add shared helpers for:
  - role checks
  - route access logic
  - field error mapping
  - app-level constants
- Establish feature conventions for future modules
- Ensure store setup is ready for auth bootstrap and future slices

### Notes

This phase is mostly architectural and should not aim for visible product features beyond improving reliability.

---

## Phase 1. Authentication and Session Bootstrap

### Goal

Make authentication fully functional and reliable across app startup, sign-in, sign-up, and logout.

### Scope

- Build sign-in page
- Build sign-up page
- Implement app boot session restoration using `GET /auth/me`
- Synchronize RTK Query auth endpoints with client auth state
- Add logout flow
- Add protected route handling behavior

### Deliverables

- Production-ready sign-in form
- Production-ready sign-up form
- Inline field validation and backend field error mapping
- Toast success/error feedback
- Auth bootstrap component or provider
- Auth-aware navbar state
- Redirect logic for authenticated and unauthenticated users

### Success criteria

- A newly registered user is treated as logged in immediately
- A logged-in user stays recognized after refresh using `/auth/me`
- A logged-out or expired session is handled cleanly
- Protected routes do not expose broken or flashing unauthorized content

---

## Phase 2. Public Bootcamp Discovery

### Goal

Replace placeholder course discovery pages with live backend data.

### Scope

- Connect public bootcamp listing page to `GET /bootcamps`
- Improve home page bootcamp section to consume live data where appropriate
- Update navbar links to real routes

### Deliverables

- Live `/bootcamps` listing page
- Reusable public bootcamp card mapping backend fields
- Loading, empty, and error states
- Improved public navigation behavior

### Success criteria

- Published bootcamps load from the API
- The page remains resilient when there are no bootcamps or when the request fails
- Public navigation feels consistent and usable

---

## Phase 3. Hybrid Bootcamp Detail MVP

### Goal

Move the bootcamp detail page from static data to a hybrid API-driven page without losing current richer marketing sections.

### Scope

- Load live bootcamp data from `GET /bootcamps/:slug`
- Preserve static curriculum/video/certificate/for-who sections where available
- Define a clear fallback strategy when a slug exists in API but has no matching static enrichment data

### Deliverables

- API-driven title, description, price, and primary metadata
- Hybrid rendering model for existing rich sections
- Not-found handling aligned with backend 404 behavior
- Clear separation between API-backed content and temporary static enrichment

### Success criteria

- The route is primarily driven by backend data
- Existing richer sections do not block progress
- The page is honest about what content is live versus temporary

---

## Phase 4. Smart Role-Based Dashboard Shell

### Goal

Create the authenticated app shell that all student, admin, and super-admin flows will use.

### Scope

- Build dashboard shell layout with sidebar
- Implement role-aware navigation generation
- Make `/dashboard` a smart entry point by role
- Add route guarding at layout/page level

### Deliverables

- Protected dashboard layout
- Sidebar, top area, and content region
- Role-based nav item rules
- Smart `/dashboard` page with role-aware summary content

### Success criteria

- Students, admins, and super admins all land inside one coherent app shell
- Users only see navigation relevant to their role
- Access rules are reusable and easy to maintain

---

## Phase 5. Student Experience

### Goal

Deliver the first complete authenticated user value for students.

### Scope

- Build student dashboard view
- Build `/my-courses` using `GET /enrollments/my`
- Link enrolled bootcamps back to public detail pages

### Deliverables

- Student dashboard summary
- My courses page
- Empty state for students with no enrollments
- Clean handling of loading and API errors

### Success criteria

- A student can sign in and clearly see their learning access
- Enrollments are represented cleanly and accurately
- The student experience feels coherent end-to-end

---

## Phase 6. Admin Bootcamp Management

### Goal

Enable admins and super admins to manage bootcamps from the frontend.

### Scope

- Admin bootcamp list
- Create bootcamp flow
- Edit bootcamp flow
- Delete bootcamp flow
- Publish/unpublish actions

### Deliverables

- `/admin/bootcamps`
- `/admin/bootcamps/new`
- `/admin/bootcamps/[id]/edit`
- Reusable bootcamp form
- Slug generation and validation
- Numeric price handling
- Confirmation flow for destructive actions

### Success criteria

- Admins can fully manage the backend bootcamp lifecycle from the UI
- Draft and published status are clearly visible
- Mutations update the UI correctly and safely

---

## Phase 7. Admin Enrollment Operations

### Goal

Enable admin assignment of students into bootcamps and visibility into class rosters.

### Scope

- Build manual enrollment creation flow using `POST /enrollments`
- Build roster page using `GET /enrollments/bootcamp/:bootcampId`

### Deliverables

- `/admin/enrollments`
- `/admin/bootcamps/[id]/students`
- User selector and bootcamp selector UX
- Duplicate/conflict error handling

### Success criteria

- Admins can enroll students without leaving the admin area
- Rosters are clear and usable
- Errors such as duplicate enrollment are handled well

---

## Phase 8. User Management for Super Admin

### Goal

Enable super-admin control over role management.

### Scope

- Build user management table
- Add promote action
- Add demote action
- Reflect role constraints in UX

### Deliverables

- `/admin/users` or `/super-admin/users` decision implemented within the dashboard shell
- Role badges
- Promote/demote actions
- Confirmation and feedback UX

### Success criteria

- Super admins can manage roles safely
- Admin users can view only what their permissions allow
- Conflict and forbidden responses are handled gracefully

---

## Phase 9. Audit Log Experience

### Goal

Expose system-level accountability to super admins.

### Scope

- Build audit log table using `GET /audit/logs`
- Add filters
- Add pagination controls

### Deliverables

- Audit log page
- Filter bar for action, resource type, actor, date range
- Paginated navigation or load-more behavior
- Useful formatting for metadata and actor context

### Success criteria

- Super admins can inspect system activity with confidence
- Filtering and pagination feel efficient and predictable

---

## Phase 10. Production Readiness Pass

### Goal

Harden the frontend after feature delivery.

### Scope

- UX polish
- accessibility pass
- loading-state consistency
- edge-case review
- error-state review
- route protection review
- code cleanup
- documentation updates

### Deliverables

- Reduced duplication
- More consistent design language across public and dashboard areas
- Finalized empty/error/loading patterns
- Security and access review
- Updated developer documentation for future contributors

### Success criteria

- The frontend feels cohesive rather than stitched together
- Core flows behave reliably under normal and failure conditions
- The project is easier to extend after MVP completion

---

## 8. Recommended Build Order Inside the Codebase

To keep implementation modular, we should touch the codebase in this approximate sequence:

1. `store/` and shared API/error infrastructure
2. `features/auth/`
3. `app/(auth)/`
4. shared navbar/auth-aware public navigation
5. `features/bootcamps/` public listing and detail integration
6. `app/(dashboard)/` authenticated shell
7. `features/enrollments/` student flows
8. `features/bootcamps/` admin management flows
9. `features/users/`
10. `features/audit/`

This sequencing reduces rework because auth and layout foundations come before protected feature pages.

---

## 9. Technical Standards We Should Follow During Implementation

### API and data

- Use RTK Query for all backend communication
- Do not introduce ad hoc `fetch` or `axios` calls for feature work
- Keep endpoint logic inside feature APIs
- Normalize backend errors centrally

### Components

- Prefer small, focused components
- Separate feature containers from reusable UI components
- Avoid placing too much domain logic directly inside route files

### Forms

- Validate before submit where possible
- Map backend field errors back into the form
- Disable submit during in-flight mutation
- Show inline errors and toasts together

### Auth and access

- Never trust frontend-only hiding for security
- Always support backend 401 and 403 responses gracefully
- Keep role checks reusable and centralized

### UX

- Every async screen should have loading, empty, and error states
- Destructive actions should require confirmation
- Success states should be visible and reassuring

### Maintainability

- Use clear naming by domain
- Prefer feature-local types and helpers when they are not cross-cutting
- Document conventions when introducing non-obvious patterns

---

## 10. Risks and Watchouts

### 10.1 Session behavior across environments

Because auth is cookie-based and currently tuned for local development, frontend behavior may differ if backend deployment strategy changes later. For now, local integration should remain the reference setup.

### 10.2 Hybrid bootcamp detail complexity

We must avoid coupling the API-driven bootcamp model too tightly to the static rich-content structure, because those richer sections are temporary and may later come from the backend in a different format.

### 10.3 Role-based shell creep

If we do not centralize role navigation and access rules early, the dashboard area will become inconsistent and hard to maintain.

### 10.4 Placeholder route growth

If pages are built directly in route files without feature modules, the codebase will become fragile quickly. We should maintain the feature-first structure consistently.

---

## 11. Definition of Done for Each Phase

Each phase should be considered done only when:

1. The feature works against the real backend API contract.
2. Loading, empty, success, and error states are handled.
3. Role and access behavior is correct.
4. Code fits the agreed architecture.
5. The change does not break existing completed phases.

---

## 12. Immediate Next Step

The next implementation phase should be:

**Phase 0: Frontend Foundation Hardening**

Why:

- it gives us a clean API/error/auth foundation
- it reduces risk before building visible flows
- it makes the rest of the work faster and more consistent

After Phase 0, we should proceed directly to:

**Phase 1: Authentication and Session Bootstrap**

That will unlock the rest of the protected application cleanly.
