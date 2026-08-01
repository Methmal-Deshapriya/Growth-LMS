import React from "react";
import { GraduationCap, Users, TrendingUp } from "lucide-react";
import { PathChoice } from "./PathChoice";
import { HeroIllustration } from "./HeroIllustration";

const FEATURES = [
  { icon: GraduationCap, title: "Learn", body: "Industry-relevant skills" },
  { icon: Users, title: "Practice", body: "Real-world projects" },
  { icon: TrendingUp, title: "Grow", body: "Build your career with confidence" },
];

export function WelcomeSlide() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 xl:gap-16 items-center px-2">
      {/* Left column */}
      <div className="text-left">
        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#0E1116] leading-tight tracking-tight">
          Welcome to
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
            Foundry Academy
          </span>
        </h1>
        <div className="w-14 h-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 mt-3 sm:mt-4 mb-3 sm:mb-4" />

        <p className="font-alt text-[#5B6472] text-sm sm:text-base max-w-md">
          We help beginners become job-ready developers, designers, and
          analysts — through practical bootcamps, real mentorship, and
          hands-on projects.
        </p>

        <div className="bg-[#F5F6FA] rounded-2xl p-3 sm:p-4 mt-4 sm:mt-5 grid grid-cols-3 gap-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                <Icon className="h-4 w-4" />
              </div>
              <p className="font-alt text-sm font-semibold text-[#0E1116]">{title}</p>
              <p className="font-alt text-xs text-[#5B6472] leading-snug">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <PathChoice />
        </div>
      </div>

      {/* Right column */}
      <div className="hidden lg:block">
        <HeroIllustration />
      </div>
    </div>
  );
}
