"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectIsAuthResolved } from "../authSelectors";

/**
 * useGuestGuard
 *
 * Redirects to /dashboard once the session resolves as authenticated.
 * Shared by GuestGuard (wraps forgot-password/reset-password/verify-email
 * routes) and AuthSlide (the landing page's sign-up/sign-in slide, which
 * isn't a route so can't use a route-level guard component).
 */
export function useGuestGuard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enrollmentCourseId = searchParams.get("enrollCourse");
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthResolved = useAppSelector(selectIsAuthResolved);

  useEffect(() => {
    if (isAuthResolved && isAuthenticated) {
      const intent = enrollmentCourseId
        ? `?enrollCourse=${encodeURIComponent(enrollmentCourseId)}`
        : "";
      router.replace(`/dashboard${intent}`);
    }
  }, [enrollmentCourseId, isAuthenticated, isAuthResolved, router]);

  return { isAuthResolved, isAuthenticated };
}
