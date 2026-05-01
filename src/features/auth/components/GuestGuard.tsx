"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectIsAuthResolved } from "../authSelectors";
import { Loader2 } from "lucide-react";

/**
 * GuestGuard Component
 * 
 * Protects routes that should only be accessible to guests (e.g. sign-in, sign-up).
 * If the user IS authenticated, it redirects them to the dashboard.
 */
export default function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthResolved = useAppSelector(selectIsAuthResolved);

  useEffect(() => {
    // If we've checked the session and the user IS authenticated
    if (isAuthResolved && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isAuthResolved, router]);

  // While checking or if already authenticated (before redirect happens)
  if (!isAuthResolved || isAuthenticated) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
