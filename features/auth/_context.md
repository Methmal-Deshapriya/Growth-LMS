# Auth Feature — Context

## Purpose

Handles user registration, login, logout, and session hydration.
Authentication is **cookie-based** (HTTP-only `token` cookie set by the backend).
The frontend cannot read the token directly — it must call `/auth/me` to know current login state.

## API Endpoints

Base path: `/api/v1/auth`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/auth/register` | Public | Register and auto-login. Sets cookie. Returns User. |
| POST | `/auth/login` | Public | Login. Sets cookie. Returns User. |
| POST | `/auth/logout` | Public | Clears cookie. |
| GET | `/auth/me` | Private | Returns current user from cookie session. |

All requests must include `credentials: "include"` — handled by `store/baseApi.ts`.

## Request / Response Shapes

### POST `/auth/register`
```json
// Request body
{ "name": "Test User", "email": "test@example.com", "password": "password123" }

// Success response data
{ "id": "uuid", "name": "Test User", "email": "test@example.com", "role": "STUDENT", "createdAt": "..." }
```

### POST `/auth/login`
```json
// Request body
{ "email": "test@example.com", "password": "password123" }

// Same data shape as register
```

### GET `/auth/me`
```json
// No body. Returns same User shape.
// 401 if no valid session cookie.
```

## State Managed

`authSlice.ts` holds:
- `user: User | null`
- `isAuthenticated: boolean`

Flow on app boot:
1. Call `useGetMeQuery()` via RTK Query
2. On success → dispatch `setUser(data)`
3. On 401 → dispatch `clearUser()`

## Files

- `authApi.ts` — RTK Query endpoints (login, register, logout, getMe)
- `authSlice.ts` — Redux slice (user, isAuthenticated)
- `authTypes.ts` — User, Role, LoginRequest, RegisterRequest, ApiResponse types
- `components/SignInForm.tsx` — Sign-in form (to be implemented)
- `components/SignUpForm.tsx` — Sign-up form (to be implemented)

## Roles

- `STUDENT` — default on register
- `ADMIN` — promoted by SUPER_ADMIN
- `SUPER_ADMIN` — root level access

Role is read from `user.role` in auth state to gate UI.