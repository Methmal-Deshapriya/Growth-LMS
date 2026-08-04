"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole, selectAuthUser } from "@/features/auth/authSelectors";
import {
  BookOpen,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { isStudent, isSuperAdmin } from "@/lib/access";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
/**
 * Smart Dashboard Page
 *
 * Adapts its content and summary metrics based on the user's role.
 */
export default function DashboardPage() {
  const role = useAppSelector(selectAuthRole);
  const user = useAppSelector(selectAuthUser);

  return (
    <div className="space-y-10">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your learning journey today.
          </p>
        </div>

        {isStudent(role) && (
          <Button asChild className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/bootcamps">
              Explore More Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* 2. Role-Based Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* --- Card 1 --- */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {isStudent(role) ? "Your Courses" : "Total Courses"}
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {isStudent(role) ? "2" : "12"}
            </h3>
          </div>
        </div>

        {/* --- Card 2 --- */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {isStudent(role) ? "Completed" : "Total Students"}
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {isStudent(role) ? "45%" : "480"}
            </h3>
          </div>
        </div>

        {/* --- Card 3 (Role Specific) --- */}
        {isSuperAdmin(role) ? (
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                System Health
              </p>
              <h3 className="text-2xl font-bold text-green-500">OPTIMAL</h3>
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Next Session
              </p>
              <h3 className="text-2xl font-bold text-foreground truncate">
                Tomorrow, 10 AM
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* 3. Role-Based Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {isStudent(role) ? "Recently Accessed" : "Recent Activity"}
              </h2>
              <Link
                href="#"
                className="text-sm font-semibold text-primary hover:text-primary"
              >
                View all
              </Link>
            </div>
            <div className="p-12 text-center">
              <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-foreground font-semibold mb-1">
                No recent activity found
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Once you start interacting with the platform, your activity will
                show up here.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Quick Links / Community */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">Need help?</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Our community and instructors are here to support you in your tech
              journey.
            </p>
            <Button className="w-full bg-card text-primary hover:bg-primary/10 font-bold">
              Join Community
            </Button>
          </div>

          {/* Announcements */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-foreground mb-4">Announcements</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-foreground leading-snug">
                  New &quot;Advanced React Patterns&quot; module is now live!
                </p>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-foreground leading-snug">
                  Next Live QA session with Anushka starts in 2 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
