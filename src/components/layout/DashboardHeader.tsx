"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { Bell, Search, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * DashboardHeader Component
 *
 * Provides global utility actions and search for the dashboard area.
 */
export default function DashboardHeader() {
  const user = useAppSelector(selectAuthUser);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-8 backdrop-blur-md">
      {/* Left: Search Bar Placeholder */}
      <div className="hidden md:flex w-96 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search bootcamps or students..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <ThemeToggle />

        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            2
          </span>
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              View Profile
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {user?.firstName?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
