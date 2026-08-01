import React from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

// Fades the bottom of a portrait into the slide's white background instead
// of ending in a hard edge or a boxed card.
const FADE_MASK: React.CSSProperties = {
  maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
};

const SUPERVISOR = {
  name: "Pasindu Athukorala",
  professionalRole: "Leading A/L ICT Teacher",
  achievement: "Island Rank 10 — Technology Stream, 2021",
  education: "Undergraduate — University of Sri Jayewardenepura",
  imageSrc: "/assets/prageesha.png",
  imageAlt: "Pasindu Athukorala, Programme Supervisor at Foundry Academy",
};

const INSTRUCTORS = [
  {
    id: "anushka",
    name: "Anushka Sudheera",
    professionalRole: "AI/ML Engineer at Olee AI",
    achievement: "Island Rank 5 — Technology Stream, 2021",
    education: "Undergraduate — University of Sri Jayewardenepura",
    imageSrc: "/assets/anushkas-Photoroom.png",
    imageAlt: "Anushka Sudheera, AI/ML Instructor at Foundry Academy",
  },
  {
    id: "methmal",
    name: "Methmal Deshapriya",
    professionalRole: "Software Engineer at Olee AI",
    achievement: "Island Rank 15 — Technology Stream, 2021",
    education: "Undergraduate — University of Sri Jayewardenepura",
    imageSrc: "/assets/methmals-Photoroom.png",
    imageAlt:
      "Methmal Deshapriya, Software Engineering Instructor at Foundry Academy",
  },
];

export function Instructors() {
  return (
    <div className="relative isolate w-full max-w-6xl mx-auto px-2 -mt-4 sm:-mt-10">
      <div className="absolute inset-0 -z-10 flex items-start justify-center pt-2 sm:pt-4 select-none">
        <h2 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-blue-200 text-center">
          Meet the people
          <br />
          behind your learning
        </h2>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-10 items-start mt-8 sm:mt-14">
        {/* Supervisor */}
        <Reveal>
          <div
            className="relative w-full max-w-[280px] mx-auto md:mx-0 aspect-3/4"
            style={FADE_MASK}
          >
            <Image
              src={SUPERVISOR.imageSrc}
              alt={SUPERVISOR.imageAlt}
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="max-w-[280px] mx-auto md:mx-0 text-center md:text-left mt-3">
            <p className="font-sans font-semibold text-sm text-[#0E1116]">
              {SUPERVISOR.name}
            </p>
            <p className="font-alt text-xs text-[#5B6472] mt-1">
              {SUPERVISOR.professionalRole}
            </p>
            <div className="mt-2 pt-2 border-t border-black/10 space-y-0.5">
              <p className="font-alt text-xs text-[#5B6472]">
                {SUPERVISOR.achievement}
              </p>
              <p className="font-alt text-xs text-[#5B6472]">
                {SUPERVISOR.education}
              </p>
            </div>
            <p className="font-alt text-xs text-blue-600 font-medium mt-2">
              Provides programme guidance
            </p>
          </div>
        </Reveal>

        {/* Instructors — one connected photo frame, split in two */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {INSTRUCTORS.map((person) => (
              <div
                key={person.id}
                className="relative aspect-3/4"
                style={FADE_MASK}
              >
                <Image
                  src={person.imageSrc}
                  alt={person.imageAlt}
                  fill
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-5 mt-4">
            {INSTRUCTORS.map((person) => (
              <div key={person.id} className="text-center">
                <p className="font-sans font-semibold text-base text-[#0E1116]">
                  {person.name}
                </p>
                <p className="font-alt text-xs text-[#5B6472] mt-1">
                  {person.professionalRole}
                </p>
                <div className="mt-2 pt-2 border-t border-black/5 space-y-0.5">
                  <p className="font-alt text-xs text-[#5B6472]">
                    {person.achievement}
                  </p>
                  <p className="font-alt text-xs text-[#5B6472]">
                    {person.education}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default Instructors;
