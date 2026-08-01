"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SignUpForm from "@/features/auth/components/SignUpForm";
import SignInForm from "@/features/auth/components/SignInForm";
import { useGuestGuard } from "@/features/auth/hooks/useGuestGuard";

/**
 * AuthSlide
 *
 * The landing page's final slide — hosts sign-in by default (most visitors
 * reaching this slide already have an account), toggling to sign-up in
 * place (no navigation) via either form's cross-link. Deep-link directly
 * to the sign-up view with /?slide=auth&authView=sign-up.
 *
 * Owns the shared two-column shell (form panel + branding panel), matching
 * WelcomeSlide's proportions — only the form panel's contents swap between
 * views; the branding panel stays exactly the same either way.
 */
export function AuthSlide() {
  const searchParams = useSearchParams();
  const [view, setView] = React.useState<"sign-up" | "sign-in">(
    searchParams.get("authView") === "sign-up" ? "sign-up" : "sign-in"
  );

  // Same behavior GuestGuard gave the old /sign-in /sign-up routes — bounce
  // already-authenticated visitors straight to the dashboard.
  useGuestGuard();

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 xl:gap-16 items-center px-2">
      {/* Left column — swappable form */}
      <div className="w-full max-w-lg mx-auto lg:mx-0">
        {view === "sign-up" ? (
          <SignUpForm onSignInClick={() => setView("sign-in")} />
        ) : (
          <SignInForm onSignUpClick={() => setView("sign-up")} />
        )}
      </div>

      {/* Right column — branding image, unchanged across both views. The
          image is 3:2 (landscape) — the aspect ratio here matches it
          exactly so nothing gets cropped or letterboxed. */}
      <div className="hidden lg:block relative w-full aspect-3/2">
        <Image
          src="/login-image.png"
          alt="Become job-ready in AI, Full-Stack & Cybersecurity"
          fill
          sizes="(min-width: 1024px) 40vw, 0px"
          className="object-contain"
          priority
        />
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-alt text-xs tracking-wide text-slate-500/80">
          Built by{" "}
          <Link
            href="https://xoxodevs.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 hover:opacity-80 transition-opacity"
          >
            xOxOdevs
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthSlide;
