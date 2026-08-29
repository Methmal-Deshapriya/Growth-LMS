import React from "react";
import { CATALOG_GRADIENT_BG } from "@/components/marketing/catalog/background";

/**
 * Shared shell for the auth pages that stay as dedicated routes
 * (forgot-password, reset-password, verify-email, verify-login) — just the page-level
 * gradient wash + centering, matching the rest of the public site. No logo,
 * no card — the forms themselves carry the same plain, no-card styling as
 * the sign-up/sign-in forms.
 */
export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh w-full flex flex-col items-center justify-center p-4"
      style={{ background: CATALOG_GRADIENT_BG }}
    >
      {children}
    </div>
  );
}
