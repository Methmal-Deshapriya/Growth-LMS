"use client";

import React from "react";
import { GraduationCap, FlaskConical, Compass } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { CATALOG_GRADIENT_BG } from "@/components/marketing/catalog/background";
import { PageSlide } from "@/components/marketing/catalog/PageSlide";
import { ContactCTAButton } from "@/components/marketing/catalog/ContactCTAButton";

const AREAS = [
  {
    icon: GraduationCap,
    color: "text-blue-600 bg-blue-100",
    title: "University Projects",
    description:
      "Hands-on guidance for coursework and final-year projects — from scoping the idea to getting it working and presentable.",
    points: ["Project scoping and planning", "Technical direction and reviews", "Getting unstuck when things break"],
  },
  {
    icon: FlaskConical,
    color: "text-indigo-600 bg-indigo-100",
    title: "Research Projects",
    description:
      "Support for research-driven work — structuring the problem, methodology, and getting to a solid, defensible result.",
    points: ["Structuring the research problem", "Methodology and tooling advice", "Feedback on write-ups and findings"],
  },
  {
    icon: Compass,
    color: "text-emerald-600 bg-emerald-100",
    title: "Guidance Toward Success",
    description:
      "Ongoing mentorship for students who want a steady hand through the whole process, not just a one-off fix.",
    points: ["Regular check-ins", "Career and next-step advice", "Honest, practical feedback"],
  },
];

export default function ConsultationsPage() {
  return (
    <PageSlide
      background={CATALOG_GRADIENT_BG}
      backHref="/?slide=services"
      backLabel="Home"
      crumbs={[
        { label: "Home", href: "/?slide=services" },
        { label: "Consultations", href: "/consultations", current: true },
      ]}
    >
      <div className="w-full max-w-5xl mx-auto px-2">
        <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="font-alt text-xs sm:text-sm font-semibold tracking-widest uppercase text-blue-600 mb-2">
            Project Consultations
          </p>
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#0E1116] leading-tight tracking-tight">
            Guidance when it{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
              actually matters
            </span>
          </h1>
          <div className="w-14 h-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 mt-4 mb-4 mx-auto" />
          <p className="font-alt text-[#5B6472] text-sm sm:text-base">
            We help students push university and research projects across the finish line.
          </p>
        </Reveal>

        <Reveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {AREAS.map(({ icon: Icon, color, title, description, points }) => (
            <RevealItem key={title}>
              <div className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-5 sm:p-6 h-full">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-sans font-semibold text-lg text-[#0E1116] mb-1">{title}</h3>
                <p className="font-alt text-sm text-[#5B6472] mb-3 leading-snug">{description}</p>
                <ul className="space-y-1.5">
                  {points.map((point) => (
                    <li key={point} className="font-alt text-xs text-[#5B6472] flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-blue-600 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal
          delay={0.1}
          className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto"
        >
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#0E1116] mb-2">Book a session</h2>
          <p className="font-alt text-[#5B6472] text-sm sm:text-base mb-6 max-w-md mx-auto">
            Tell us a bit about your project and we&apos;ll get back to you to set up a time.
          </p>
          <ContactCTAButton
            message="Hello! I'd like to book a project consultation session."
            label="Book a session"
          />
        </Reveal>
      </div>
    </PageSlide>
  );
}
