"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShieldCheck,
  FileText,
  Award,
  FolderCode,
  Library,
  type LucideIcon,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import {
  isStudent,
  canAccessAdminArea,
  canViewUsers,
  canViewAuditLogs,
} from "@/lib/access";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * DashboardNavMain
 *
 * Flat, role-gated navigation list — ported from the previous hand-rolled
 * sidebar's navItems array. No nested sub-items exist in this app's IA, so
 * this renders as simple SidebarMenuButtons rather than stock nav-main's
 * Collapsible sub-menu pattern.
 */
export function DashboardNavMain() {
  const pathname = usePathname();
  const user = useAppSelector(selectAuthUser);
  const role = user?.role ?? null;

  const overviewItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ...(isStudent(role)
      ? [
          { label: "My Courses", href: "/my-courses", icon: BookOpen },
          { label: "Certificates", href: "/certificates", icon: Award },
          { label: "My Projects", href: "/projects", icon: FolderCode },
        ]
      : []),
  ];

  const adminItems: NavItem[] = canAccessAdminArea(user)
    ? [
        { label: "Services", href: "/admin/services", icon: ShieldCheck },
        { label: "Session Library", href: "/admin/sessions", icon: Library },
        { label: "Manage Certificates", href: "/admin/certificates", icon: Award },
        { label: "Review Projects", href: "/admin/projects", icon: FolderCode },
      ]
    : [];

  const superAdminItems: NavItem[] = [
    ...(canViewUsers(user) ? [{ label: "Users", href: "/admin/users", icon: Users }] : []),
    ...(canViewAuditLogs(user) ? [{ label: "Audit Logs", href: "/admin/audit", icon: FileText }] : []),
  ];

  const isItemActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const renderGroup = (label: string, items: NavItem[]) => {
    if (items.length === 0) return null;
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isItemActive(item.href)} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  };

  return (
    <>
      {renderGroup("Overview", overviewItems)}
      {renderGroup("Administration", [...adminItems, ...superAdminItems])}
    </>
  );
}
