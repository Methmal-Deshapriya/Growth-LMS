import { ROLES, type Role } from "@/lib/constants";

export function hasRole(
  userRole: Role | null | undefined,
  allowedRoles: readonly Role[]
) {
  return !!userRole && allowedRoles.includes(userRole);
}

export function isStudent(userRole: Role | null | undefined) {
  return userRole === ROLES.STUDENT;
}

export function isAdmin(userRole: Role | null | undefined) {
  return userRole === ROLES.ADMIN;
}

export function isSuperAdmin(userRole: Role | null | undefined) {
  return userRole === ROLES.SUPER_ADMIN;
}

export function canAccessAdminArea(userRole: Role | null | undefined) {
  return hasRole(userRole, [ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

export function canManageUsers(userRole: Role | null | undefined) {
  return isSuperAdmin(userRole);
}

export function canViewAuditLogs(userRole: Role | null | undefined) {
  return isSuperAdmin(userRole);
}

