"use client";

import { Suspense } from "react";
import Services from "@/components/marketing/Services";
import { PathProvider } from "@/components/marketing/companion/PathContext";
import { WelcomeSlide } from "@/components/marketing/companion/WelcomeSlide";
import { SlideDeck, type Slide } from "@/components/marketing/companion/SlideDeck";

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
];

export default function Home() {
  return (
    <Suspense fallback={null}>
      <PathProvider>
        <SlideDeck slides={slides} />
      </PathProvider>
    </Suspense>
  );
}
