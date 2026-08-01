import React from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import type { PublicServiceConfig } from "./types";

function DecorativeMotif({ gradient }: { gradient: string }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-[0.08]`}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute -top-10 -left-10 w-56 h-56 bg-white/60 rounded-full blur-3xl" />
      <div className={`absolute -bottom-10 -right-10 w-64 h-64 rounded-full blur-3xl bg-linear-to-br ${gradient} opacity-20`} />
    </div>
  );
}

export function ServiceHero({ hero, accent }: Pick<PublicServiceConfig, "hero" | "accent">) {
  return (
    <Reveal className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center mb-8 sm:mb-10">
      <div>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0E1116] leading-tight tracking-tight text-center">
          {hero.title}
          {hero.highlight && (
            <>
              {" "}
              <span className={`text-transparent bg-clip-text bg-linear-to-r ${accent.gradient}`}>
                {hero.highlight}
              </span>
            </>
          )}
        </h1>

        <div className="flex flex-wrap gap-2.5 mt-6">
          {hero.indicators.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 font-alt text-xs sm:text-sm text-[#5B6472] bg-white/80 backdrop-blur-sm border border-black/10 rounded-full px-3 py-1.5"
            >
              <Icon className={`h-3.5 w-3.5 ${accent.text}`} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden lg:block relative">
        {hero.illustration ? (
          <Image
            src={hero.illustration.src}
            alt={hero.illustration.alt}
            width={1536}
            height={1024}
            className="w-full h-auto drop-shadow-2xl"
            priority
          />
        ) : (
          <DecorativeMotif gradient={accent.gradient} />
        )}
      </div>
    </Reveal>
  );
}
