# Foundry LMS Frontend — Architecture

## Stack

| Concern | Tool |
|---------|------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State / Server cache | Redux Toolkit + RTK Query |
| UI Primitives | shadcn/ui (Radix) |
| Animation | Framer Motion (motion) |
| Smooth scroll | Lenis |

---

## Folder Structure

```
Growth-LMS/
├── app/                    Next.js App Router — routing only, no business logic
│   ├── (public)/           Guest-accessible pages (home, bootcamp listing, detail)
│   ├── (auth)/             Auth pages (sign-in, sign-up)
│   ├── (dashboard)/        Authenticated pages (student, admin, super-admin)
│   └── layout.tsx          Root layout — wraps StoreProvider
│
├── features/               Feature modules — all domain logic lives here
│   ├── auth/
│   ├── bootcamps/
│   ├── enrollments/
│   ├── users/
│   └── audit/
│
├── components/             Shared, stateless, domain-agnostic components
│   ├── ui/                 shadcn primitives (Button, Card, Switch, etc.)
│   ├── layout/             Navbar, Footer
│   └── marketing/          Homepage marketing sections (Hero, BootCamps, Steps, etc.)
│
├── store/                  Redux store wiring
│   ├── baseApi.ts          Single RTK Query createApi instance
│   ├── store.ts            configureStore — assembles all reducers
│   └── StoreProvider.tsx   <Provider store={store}> used in root layout
│
├── lib/
│   ├── utils.ts            cn() helper + static data helpers
│   └── constants.ts        ROLES enum, API_BASE_URL constant
│
└── docs/
    ├── frontend_dev_guide.md   Full API contract reference
    └── architecture.md         This file
```

---

## Three Core Rules

### 1. `store/baseApi.ts` is the single RTK Query origin

All feature API slices extend `baseApi` using `injectEndpoints`. This means:
- One shared RTK Query cache
- `credentials: "include"` set once, applies everywhere
- `NEXT_PUBLIC_API_BASE_URL` referenced once

### 2. `features/` owns domain logic, `app/` owns routing

Pages inside `app/` do only two things:
1. Import feature components and hooks
2. Handle layout and routing

No business logic, no direct API calls, no type definitions live inside `app/`.

### 3. `_context.md` is the AI agent entry point per feature

Every feature module has a `_context.md` that documents:
- What the module does
- Which API endpoints it owns (with request/response shapes)
- What state it manages
- What components it contains

When working on a feature, read or provide `features/<name>/_context.md` as context.

---

## Data Flow

```
Page (app/)
  └── calls RTK Query hook from features/<name>/<name>Api.ts
        └── uses store/baseApi.ts baseQuery (credentials:include, base URL)
              └── hits Express API at NEXT_PUBLIC_API_BASE_URL
                    └── returns { success, data, message }
                          └── transformResponse unwraps .data
                                └── component renders
```

---

## Authentication Flow

Auth is **cookie-based**. The backend sets an HTTP-only `token` cookie on login/register.

1. App boots → root layout renders → `StoreProvider` mounts
2. Dashboard layout calls `useGetMeQuery()` from `features/auth/authApi.ts`
3. On success → dispatch `setUser(data)` → `authSlice` sets `isAuthenticated: true`
4. On 401 → dispatch `clearUser()` → redirect to `/sign-in`
5. Role is read from `user.role` in auth state to gate UI elements

**Never** check localStorage for auth state. The cookie is HTTP-only and unreadable by JS.
**Always** rely on `/api/v1/auth/me` as the source of truth.

---

## Route Protection

| Route group | Who can access |
|-------------|----------------|
| `(public)/` | Anyone |
| `(auth)/` | Guests only — redirect authenticated users to dashboard |
| `(dashboard)/dashboard`, `/my-courses` | Any authenticated user |
| `(dashboard)/admin/*` | ADMIN or SUPER_ADMIN |
| `(dashboard)/admin/users`, `/admin/audit` | SUPER_ADMIN only |

Protection is enforced in `app/(dashboard)/layout.tsx` by checking `user.role` from auth state.

---

## Adding a New Feature

1. Create `features/<name>/` with `_context.md`, `<name>Api.ts`, `<name>Types.ts`
2. Inject endpoints into `baseApi` using `baseApi.injectEndpoints()`
3. Add new `tagTypes` to `store/baseApi.ts` if needed
4. Add the new API reducer to `store/store.ts` (handled automatically via `injectEndpoints`)
5. Create components in `features/<name>/components/`
6. Create page files in the appropriate `app/` route group
7. Document the feature in `_context.md`

---

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

Set in `.env.local` for development. All API calls route through this base URL.