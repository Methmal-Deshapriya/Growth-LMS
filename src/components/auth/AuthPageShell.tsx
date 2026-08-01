import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATALOG_GRADIENT_BG } from "@/components/marketing/catalog/background";

/**
 * Shared shell for the auth pages that stay as dedicated routes
 * (forgot-password, reset-password, verify-email) — replaces what used to
 * be a copy-pasted "centered flex + logo" block in each page.tsx, restyled
 * to match the rest of the public site instead of the plain background.
 */
export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh w-full flex flex-col items-center justify-center p-4"
      style={{ background: CATALOG_GRADIENT_BG }}
    >
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <Image src="/assets/logo.png" alt="Foundry Academy" width={150} height={150} />
      </Link>
      {children}
    </div>
  );
}
