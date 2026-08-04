"use client";

import { Button } from "@/components/ui/button";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-dvh items-center justify-center bg-white px-6"><div className="max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-[#0E1116]">We couldn&apos;t load this page</h1><p className="mt-3 text-sm text-[#5B6472]">The learning catalog may be temporarily unavailable. Please try again.</p><Button className="mt-6" onClick={reset}>Try again</Button></div></main>;
}
