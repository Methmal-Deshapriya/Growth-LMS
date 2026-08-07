"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole, selectAuthUser } from "@/features/auth/authSelectors";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShieldCheck,
  FileText,
  LogOut,
  PlusCircle,
  Award,
  FolderCode,
  Library,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isStudent,
  canAccessAdminArea,
  canViewUsers,
  canViewAuditLogs
} from "@/lib/access";
import { useLogoutMutation } from "@/features/auth/authApi";
import { toast } from "sonner";

/**
 * DashboardSidebar Component
 *
 * Renders the main navigation for authenticated users, as a floating navy
 * panel alongside the main content area. It collapses to an icon-only rail,
 * and navigation items are filtered based on the user's role.
 */
export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAppSelector(selectAuthRole);
  const user = useAppSelector(selectAuthUser);
  const [logout] = useLogoutMutation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed((previous) => !previous);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Logout failed");
      router.push("/");
    }
  };

  // Define navigation items with access rules
  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
      show: true,
    },
    {
      label: "My Courses",
      href: "/my-courses",
      icon: BookOpen,
      active: pathname.startsWith("/my-courses"),
      show: isStudent(role),
    },
    {
      label: "Certificates",
      href: "/certificates",
      icon: Award,
      active: pathname.startsWith("/certificates"),
      show: isStudent(role),
    },
    {
      label: "My Projects",
      href: "/projects",
      icon: FolderCode,
      active: pathname.startsWith("/projects"),
      show: isStudent(role),
    },
    // --- Admin Section ---
    {
      label: "Course Catalog",
      href: "/admin/catalog/courses",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin/catalog"),
      show: canAccessAdminArea(role),
    },
    {
      label: "Enrollments",
      href: "/admin/enrollments",
      icon: PlusCircle,
      active: pathname.startsWith("/admin/enrollments"),
      show: canAccessAdminArea(role),
    },
    {
      label: "Session Library",
      href: "/admin/sessions",
      icon: Library,
      active: pathname.startsWith("/admin/sessions"),
      show: canAccessAdminArea(role),
    },
    {
      label: "Manage Certificates",
      href: "/admin/certificates",
      icon: Award,
      active: pathname.startsWith("/admin/certificates"),
      show: canAccessAdminArea(role),
    },
    {
      label: "Review Projects",
      href: "/admin/projects",
      icon: FolderCode,
      active: pathname.startsWith("/admin/projects"),
      show: canAccessAdminArea(role),
    },
    // --- Super Admin Section ---
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
      show: canViewUsers(role),
    },
    {
      label: "Audit Logs",
      href: "/admin/audit",
      icon: FileText,
      active: pathname.startsWith("/admin/audit"),
      show: canViewAuditLogs(role),
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex shrink-0 flex-col rounded-2xl bg-sidebar transition-[width] duration-200",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-colors hover:bg-sidebar-accent"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        {/* Logo Area */}
        <Link
          href="/"
          className={cn("mb-8 flex items-center py-2", collapsed ? "justify-center px-0" : "px-2")}
        >
          {collapsed ? (
            <span className="text-xl font-extrabold text-sidebar-primary">F</span>
          ) : (
            <span className="text-xl font-extrabold tracking-tight text-sidebar-foreground">
              Foundry<span className="text-sidebar-primary">Academy</span>
            </span>
          )}
        </Link>

        {/* User Brief */}
        {!collapsed && (
          <div className="mb-6 rounded-xl bg-white/5 p-4">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
              {role}
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.filter(item => item.show).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", item.active && "text-sidebar-primary")} />
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>

        {/* Footer Area / Logout */}
        <div className="mt-auto border-t border-sidebar-border pt-4">
          <button
            onClick={handleLogout}
            title={collapsed ? "Sign Out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
