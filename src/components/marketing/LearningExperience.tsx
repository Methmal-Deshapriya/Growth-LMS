import React from "react";
import { Video, CalendarClock, BookOpen, ClipboardCheck, Award } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";

const FACTS = [
  { icon: Video, title: "Weekly", body: "Live sessions" },
  { icon: CalendarClock, title: "2–3 hrs", body: "Per session" },
  { icon: Award, title: "3–4 months", body: "Typical programme" },
];

const STAGES = [
  {
    number: "01",
    icon: Video,
    title: "Weekly live sessions",
    description: "Join guided online sessions each week, typically lasting 2–3 hours.",
    metadata: "Live · Interactive · Instructor-led",
  },
  {
    number: "02",
    icon: CalendarClock,
    title: "Learn through a clear programme",
    description: "Most programmes run for approximately 3–4 months, giving you time to learn, practise, and make steady progress.",
    metadata: "Approximately 12–16 weeks",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Study materials and notes",
    description: "Access organised notes, lesson resources, examples, and supporting materials throughout the programme.",
    metadata: "Resources available online",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Assignments and quizzes",
    description: "Reinforce each topic through practical assignments, short quizzes, and guided learning activities.",
    metadata: "Practise · Review · Improve",
  },
  {
    number: "05",
    icon: Award,
    title: "Mentorship and certification",
    description: "Receive direct guidance when you need support and earn a digitally shareable certificate after completing the required learning activities.",
    metadata: "Direct mentorship · Shareable certificate",
  },
];

export function LearningExperience() {
  return (
    <div className="w-full max-w-6xl mx-auto px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <Reveal className="text-left">
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#0E1116] leading-tight tracking-tight">
            How learning{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
              works
            </span>
          </h2>
          <p className="font-alt text-[#5B6472] text-sm sm:text-base max-w-md mt-4">
            Structured live learning, practical activities, and direct guidance — designed to help you understand
            concepts and apply them consistently.
          </p>

          <div className="bg-[#F5F6FA] rounded-2xl p-4 sm:p-5 mt-5 sm:mt-6 grid grid-cols-3 gap-4">
            {FACTS.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <p className="font-alt text-base font-semibold text-[#0E1116]">{title}</p>
                <p className="font-alt text-sm text-[#5B6472] leading-snug">{body}</p>
              </div>
            ))}
          </div>

          <p className="font-alt text-sm text-[#5B6472]/80 mt-5 max-w-md">
            A consistent weekly rhythm helps you move from understanding a concept to applying it with confidence.
          </p>
        </Reveal>

        <Reveal stagger={0.08}>
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isLast = i === STAGES.length - 1;
            return (
              <RevealItem key={stage.number} className="relative flex gap-4">
                {!isLast && (
                  <span
                    className="absolute left-[19px] top-10 bottom-0 w-px bg-black/10"
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 shrink-0 h-10 w-10 flex items-center justify-center font-mono text-base font-bold text-blue-600">
                  {stage.number}
                </div>
                <div className={isLast ? "pb-0" : "pb-7 sm:pb-8"}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    <h3 className="font-sans font-semibold text-base text-[#0E1116]">{stage.title}</h3>
                  </div>
                  <p className="font-alt text-sm text-[#5B6472] leading-relaxed">{stage.description}</p>
                  <p className="font-alt text-xs text-blue-600 font-medium mt-1.5">{stage.metadata}</p>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </div>
  );
}

export default LearningExperience;
