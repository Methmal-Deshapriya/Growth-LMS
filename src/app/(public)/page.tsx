"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Services from "@/components/marketing/Services";
import LearningExperience from "@/components/marketing/LearningExperience";
import Instructors from "@/components/marketing/Instructors";
import AuthSlide from "@/components/marketing/AuthSlide";
import { PathProvider } from "@/components/marketing/companion/PathContext";
import { WelcomeSlide } from "@/components/marketing/companion/WelcomeSlide";
import { SlideDeck, type Slide } from "@/components/marketing/companion/SlideDeck";
import { useGuestGuard } from "@/features/auth/hooks/useGuestGuard";

const slides: Slide[] = [
  {
    id: "welcome",
    content: <WelcomeSlide />,
  },
  {
    id: "services",
    content: <Services />,
    background:
      "radial-gradient(circle at 12% 15%, rgba(199,210,254,0.55), transparent 45%), radial-gradient(circle at 88% 85%, rgba(191,219,254,0.5), transparent 45%), radial-gradient(circle at 50% 45%, rgba(233,213,255,0.35), transparent 55%)",
  },
  {
    id: "how-it-works",
    content: <LearningExperience />,
    background:
      "radial-gradient(circle at 12% 15%, rgba(199,210,254,0.55), transparent 45%), radial-gradient(circle at 88% 85%, rgba(191,219,254,0.5), transparent 45%), radial-gradient(circle at 50% 45%, rgba(233,213,255,0.35), transparent 55%)",
  },
  {
    id: "instructors",
    content: <Instructors />,
  },
  {
    id: "auth",
    content: <AuthSlide />,
    background:
      "radial-gradient(circle at 12% 15%, rgba(199,210,254,0.55), transparent 45%), radial-gradient(circle at 88% 85%, rgba(191,219,254,0.5), transparent 45%), radial-gradient(circle at 50% 45%, rgba(233,213,255,0.35), transparent 55%)",
  },
];

export default function Home() {
  // Already-authenticated visitors land straight on their dashboard instead
  // of the marketing/sign-up funnel — same behavior GuestGuard gives the
  // dedicated auth-only routes.
  const { isAuthenticated } = useGuestGuard();

  if (isAuthenticated) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <PathProvider>
        <SlideDeck slides={slides} />
      </PathProvider>
    </Suspense>
  );
}
