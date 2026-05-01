"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { Bell, Search, User as UserIcon } from "lucide-react";

/**
 * DashboardHeader Component
 * 
 * Provides global utility actions and search for the dashboard area.
 */
export default function DashboardHeader() {
  const user = useAppSelector(selectAuthUser);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md">
      {/* Left: Search Bar Placeholder */}
      <div className="hidden md:flex w-96 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search bootcamps or students..." 
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border-none text-sm focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            2
          </span>
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              View Profile
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
