import React from "react";
import AuthenticatedGuard from "@/features/auth/components/AuthenticatedGuard";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthenticatedGuard>
      <div className="flex h-dvh gap-3 bg-sidebar p-3 md:gap-4 md:p-4">
        {/* Sidebar — its own rounded panel, full height */}
        <DashboardSidebar />

        {/* Main content — a separate rounded panel, floating with a gap
            from the sidebar and the outer edges */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-dashboard-surface">
          <DashboardHeader />

          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthenticatedGuard>
  );
}
