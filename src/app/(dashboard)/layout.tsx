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
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <DashboardHeader />
          
          <main className="flex-1 p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthenticatedGuard>
  );
}