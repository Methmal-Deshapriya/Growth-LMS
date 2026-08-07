import { ROLES, type Role } from "@/lib/constants";

export const PERMISSIONS = {
  USERS_VIEW: "USERS_VIEW",
  USERS_MANAGE_ROLES: "USERS_MANAGE_ROLES",
  CATALOG_VIEW_ADMIN: "CATALOG_VIEW_ADMIN",
  CATALOG_EDIT_DRAFTS: "CATALOG_EDIT_DRAFTS",
  CATALOG_PUBLISH: "CATALOG_PUBLISH",
  CATALOG_DELETE_PERMANENTLY: "CATALOG_DELETE_PERMANENTLY",
  COURSES_SELF_ENROLL: "COURSES_SELF_ENROLL",
  SESSIONS_VIEW_LIBRARY: "SESSIONS_VIEW_LIBRARY",
  SESSIONS_MANAGE_LIBRARY: "SESSIONS_MANAGE_LIBRARY",
  SESSIONS_DELETE_PERMANENTLY: "SESSIONS_DELETE_PERMANENTLY",
  COURSE_CURRICULUM_MANAGE: "COURSE_CURRICULUM_MANAGE",
  BATCHES_MANAGE: "BATCHES_MANAGE",
  BATCH_SESSIONS_RELEASE: "BATCH_SESSIONS_RELEASE",
  ENROLLMENTS_MANAGE: "ENROLLMENTS_MANAGE",
  CERTIFICATES_MANAGE: "CERTIFICATES_MANAGE",
  PROJECTS_REVIEW: "PROJECTS_REVIEW",
  AUDIT_VIEW: "AUDIT_VIEW",
} as const;
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ADMIN_PERMISSIONS: Permission[] = [
  PERMISSIONS.USERS_VIEW,
  PERMISSIONS.CATALOG_VIEW_ADMIN,
  PERMISSIONS.CATALOG_EDIT_DRAFTS,
  PERMISSIONS.SESSIONS_VIEW_LIBRARY,
  PERMISSIONS.SESSIONS_MANAGE_LIBRARY,
  PERMISSIONS.COURSE_CURRICULUM_MANAGE,
  PERMISSIONS.BATCHES_MANAGE,
  PERMISSIONS.BATCH_SESSIONS_RELEASE,
  PERMISSIONS.ENROLLMENTS_MANAGE,
  PERMISSIONS.CERTIFICATES_MANAGE,
  PERMISSIONS.PROJECTS_REVIEW,
];

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.STUDENT]: [PERMISSIONS.COURSES_SELF_ENROLL],
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
  [ROLES.SUPER_ADMIN]: [
    ...ADMIN_PERMISSIONS,
    PERMISSIONS.USERS_MANAGE_ROLES,
    PERMISSIONS.CATALOG_PUBLISH,
    PERMISSIONS.CATALOG_DELETE_PERMANENTLY,
    PERMISSIONS.SESSIONS_DELETE_PERMANENTLY,
    PERMISSIONS.AUDIT_VIEW,
  ],
};

export function hasPermission(role: Role | null | undefined, permission: Permission) {
  return Boolean(role && ROLE_PERMISSIONS[role]?.includes(permission));
}
export function hasRole(role: Role | null | undefined, allowed: readonly Role[]) { return Boolean(role && allowed.includes(role)); }
export const isStudent = (role: Role | null | undefined) => role === ROLES.STUDENT;
export const isAdmin = (role: Role | null | undefined) => role === ROLES.ADMIN;
export const isSuperAdmin = (role: Role | null | undefined) => role === ROLES.SUPER_ADMIN;
export const canAccessAdminArea = (role: Role | null | undefined) => hasPermission(role, PERMISSIONS.CATALOG_VIEW_ADMIN);
export const canManageUsers = (role: Role | null | undefined) => hasPermission(role, PERMISSIONS.USERS_MANAGE_ROLES);
export const canViewUsers = (role: Role | null | undefined) => hasPermission(role, PERMISSIONS.USERS_VIEW);
export const canViewAuditLogs = (role: Role | null | undefined) => hasPermission(role, PERMISSIONS.AUDIT_VIEW);
