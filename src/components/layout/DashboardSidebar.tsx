"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const role = useAppSelector(selectAuthRole);
  const user = useAppSelector(selectAuthUser);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Logout failed");
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform lg:translate-x-0">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo Area */}
        <Link href="/" className="mb-10 flex items-center px-2 py-4">
          <span className="text-xl font-extrabold text-blue-600 tracking-tight">
            Foundry<span className="text-gray-900">Academy</span>
          </span>
        </Link>

        {/* User Brief */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
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
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", item.active ? "text-blue-600" : "text-gray-400")} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer Area / Logout */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
