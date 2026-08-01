"use client";

import React, { useEffect } from "react";
import { useGetMeQuery } from "../authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, clearUser } from "../authSlice";
import { selectIsAuthResolved } from "../authSelectors";
import { Loader2 } from "lucide-react";

/**
 * AuthInitializer Component
 *
 * This component is responsible for "bootstrapping" the authentication state.
 * It calls the /auth/me endpoint once on app load to check if a valid session
 * cookie exists.
 *
 * While the check is in progress and the app doesn't know the auth status yet,
 * it displays a global loading screen to prevent UI flickering or unauthorized
 * content flashes.
 */
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isAuthResolved = useAppSelector(selectIsAuthResolved);

  // 1. Trigger the /auth/me query
  // We use skip: false (default) so it runs on mount.
  // RTK Query handles the caching, so this won't re-run unnecessarily.
  const { data, isLoading, isSuccess, isError } = useGetMeQuery(
    undefined,
    {
      // We want to ensure it always tries to fetch on first load
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (isSuccess && data) {
      // Session found
      dispatch(setUser(data));
    } else if (isError) {
      // No session or expired (usually 401)
      dispatch(clearUser());
    }
  }, [data, isSuccess, isError, dispatch]);

  // 2. Full-screen loading state
  // We only show this while the INITIAL check is happening (status is 'unknown').
  // Once status is 'authenticated' or 'unauthenticated', we render the children.
  if (!isAuthResolved && isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-card z-9999">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">
            Initialing Foundry Academy...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
