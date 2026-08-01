import React from "react";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import type { PublicServiceConfig } from "./types";

export function ServiceCategoryGrid({
  categorySection,
  accent,
}: Pick<PublicServiceConfig, "categorySection" | "accent">) {
  return (
    <section id="categories" className="mb-16 sm:mb-24 scroll-mt-20">
      <Reveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {categorySection.items.map((item) => {
          const Icon = item.icon;
          return (
            <RevealItem key={item.id}>
              <Link
                href={item.href}
                className="group relative flex flex-col h-full bg-white/90 backdrop-blur-sm border border-black/10 rounded-2xl p-5 hover:shadow-lg hover:border-black/20 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {item.badge && (
                  <span className="absolute top-4 right-4 flex items-center gap-1 font-alt text-[10px] font-semibold text-[#0E1116] bg-white border border-black/10 rounded-full px-2 py-0.5">
                    <Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                    {item.badge}
                  </span>
                )}

                <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 text-white bg-linear-to-br ${item.iconGradient}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 className="font-sans font-semibold text-base text-[#0E1116] mb-1">{item.title}</h3>
                <p className="font-alt text-xs text-[#5B6472] mb-4 leading-snug">{item.description}</p>

                <div className="space-y-1 mb-4">
                  {item.metadata.map((line) => (
                    <p key={line} className="font-alt text-xs text-[#5B6472]">
                      {line}
                    </p>
                  ))}
                </div>

                <div
                  className={`mt-auto flex items-center justify-between gap-1 pt-3 border-t border-black/5 font-alt text-sm font-semibold group-hover:gap-2 transition-all ${item.accentText}`}
                >
                  Explore {item.title}
                  <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </div>
              </Link>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}
