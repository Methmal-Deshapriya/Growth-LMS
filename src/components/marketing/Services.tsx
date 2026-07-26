import React from "react";
import Link from "next/link";
import { GraduationCap, BookOpen, Users, Target, ChevronRight } from "lucide-react";

const SERVICES = [
  {
    href: "/it-bootcamps",
    icon: GraduationCap,
    color: "text-blue-600 bg-blue-100",
    title: "IT Professional Bootcamps",
    description: "We design and deliver hands-on bootcamps across today's most in-demand tech fields.",
    tags: ["AI", "Machine Learning", "Software Engineering", "DevOps"],
  },
  {
    href: "/pretech-courses",
    icon: BookOpen,
    color: "text-indigo-600 bg-indigo-100",
    title: "PreTech",
    description: "Preparing university-bound students for BICT, BBST and BET with the core modules they'll need.",
    tags: ["Maths", "Physics", "Statistics", "C Programming"],
  },
  {
    href: "/contributions",
    icon: Users,
    color: "text-orange-600 bg-orange-100",
    title: "Public Contributions",
    description: "Open foundational sessions for anyone looking to build the basics that every tech career rests on.",
    tags: ["Software Eng. Fundamentals", "Git & GitHub", "General Knowledge", "General English"],
  },
  {
    href: "/consultations",
    icon: Target,
    color: "text-emerald-600 bg-emerald-100",
    title: "Project Consultations",
    description: "Guidance and support for students working through university and research projects.",
    tags: ["University Projects", "Research Projects", "Guidance Toward Success"],
  },
];

export function Services() {
  return (
    <div className="w-full">
      <div className="w-full max-w-5xl mx-auto px-2">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#0E1116] leading-tight tracking-tight">
            What we{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
              offer
            </span>
          </h2>
          <p className="font-alt text-[#5B6472] text-sm sm:text-base mt-3 sm:mt-4">
            Four ways we help people build real, job-ready skills in tech.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {SERVICES.map(({ href, icon: Icon, color, title, description, tags }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col h-full bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-sans font-semibold text-lg text-[#0E1116]">{title}</h3>
              </div>

              <p className="font-alt text-sm text-[#5B6472] mb-4 leading-snug">{description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-alt text-xs text-[#5B6472] bg-[#F5F6FA] border border-black/5 rounded-full px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-end pt-3 border-t border-black/5">
                <span className="flex items-center gap-1 font-alt text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  Explore <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
