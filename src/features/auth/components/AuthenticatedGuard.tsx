"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectIsAuthResolved } from "../authSelectors";
import { Loader2 } from "lucide-react";

/**
 * AuthenticatedGuard Component
 * 
 * Protects routes that require a user to be logged in.
 * If the user is NOT authenticated, it redirects them to the sign-in page.
 */
export default function AuthenticatedGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthResolved = useAppSelector(selectIsAuthResolved);

  useEffect(() => {
    // If we've checked the session and the user is NOT authenticated
    if (isAuthResolved && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, isAuthResolved, router]);

  // While checking or if not authenticated (before redirect happens)
  if (!isAuthResolved || !isAuthenticated) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Checking authorization...</p>
      </div>
    );
  }

  return <>{children}</>;
}
