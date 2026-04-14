import React from "react";

// Auth guard: this layout protects all dashboard routes.
// On implementation, call GET /api/v1/auth/me here.
// Redirect to /sign-in if 401, redirect to correct role area if role mismatch.
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}