"use client";

import React from "react";
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
  FolderCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  isStudent,
  canAccessAdminArea, 
  canManageUsers, 
  canViewAuditLogs 
} from "@/lib/access";
import { useLogoutMutation } from "@/features/auth/authApi";
import { toast } from "sonner";

/**
 * DashboardSidebar Component
 * 
 * Renders the main navigation for authenticated users.
 * Navigation items are filtered based on the user's role.
 */
export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAppSelector(selectAuthRole);
  const user = useAppSelector(selectAuthUser);
  const [logout] = useLogoutMutation();

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
      label: "Manage Bootcamps",
      href: "/admin/bootcamps",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin/bootcamps"),
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
      show: canManageUsers(role),
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform lg:translate-x-0">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo Area */}
        <Link href="/" className="mb-10 flex items-center px-2 py-4">
          <span className="text-xl font-extrabold text-primary tracking-tight">
            Foundry<span className="text-foreground">Academy</span>
          </span>
        </Link>

        {/* User Brief */}
        <div className="mb-6 rounded-xl bg-muted p-4">
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
            {role}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.filter(item => item.show).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", item.active ? "text-primary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer Area / Logout */}
        <div className="mt-auto border-t border-border pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
