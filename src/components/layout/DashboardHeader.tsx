"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/my-courses": "My Courses",
  "/certificates": "Certificates",
  "/projects": "My Projects",
  "/admin/catalog/courses": "Course Catalog",
  "/admin/enrollments": "Enrollments",
  "/admin/sessions": "Session Library",
  "/admin/certificates": "Manage Certificates",
  "/admin/projects": "Review Projects",
  "/admin/users": "Users",
  "/admin/audit": "Audit Logs",
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES).find((path) => pathname.startsWith(path));
  return match ? PAGE_TITLES[match] : "Dashboard";
}

/**
 * DashboardHeader Component
 *
 * Provides global utility actions and search for the dashboard area.
 * `SidebarTrigger` replaces the old hand-rolled collapse chevron button.
 * No real page hierarchy exists in this app to justify a multi-level
 * breadcrumb, so this just shows the current page's title instead.
 */
export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center gap-4 border-b border-border px-4 md:px-8">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-sm font-medium text-foreground">{getPageTitle(pathname)}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-6 ml-auto">
        <ThemeToggle />

        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            2
          </span>
        </button>
      </div>
    </header>
  );
}
