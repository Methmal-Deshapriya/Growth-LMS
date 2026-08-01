import { Layers, Users, Sparkles } from "lucide-react";
import type { PublicServiceConfig } from "@/components/marketing/public-service/types";
import { SERVICE_ACCENT } from "@/components/marketing/public-service/accent";
import { contributionsSection } from "@/data/catalog/contributions";

const AREA_META: Record<string, { description: string; iconGradient: string; accentText: string }> = {
  "software-engineering-fundamentals": {
    description: "The core thinking behind writing good software, explained simply.",
    iconGradient: "from-blue-500 to-blue-600",
    accentText: "text-blue-600",
  },
  "git-github": {
    description: "Version control and collaboration, the way real teams actually use it.",
    iconGradient: "from-rose-500 to-rose-600",
    accentText: "text-rose-600",
  },
  "general-knowledge": {
    description: "Broad awareness sessions open to absolutely anyone.",
    iconGradient: "from-emerald-500 to-emerald-600",
    accentText: "text-emerald-600",
  },
  "general-english": {
    description: "Practical communication skills for study, interviews and everyday work.",
    iconGradient: "from-amber-500 to-amber-600",
    accentText: "text-amber-600",
  },
};

export const contributionsServiceConfig: PublicServiceConfig = {
  basePath: contributionsSection.basePath,
  breadcrumbLabel: contributionsSection.eyebrow,
  accent: SERVICE_ACCENT,
  hero: {
    eyebrow: "Public Contributions",
    title: "Open sessions for anyone who wants to",
    highlight: "start learning",
    description:
      "Free, open sessions covering the basics every tech career rests on — no application, no cost, just a place to start.",
    indicators: [
      { icon: Layers, label: "4 learning areas" },
      { icon: Users, label: "Open to everyone" },
      { icon: Sparkles, label: "No cost to join" },
    ],
  },
  categorySection: {
    title: "Choose a",
    highlight: "learning area",
    description: "Pick the area you'd like to build confidence in first.",
    itemLabel: "learning areas",
    items: contributionsSection.groups.map((group) => {
      const meta = AREA_META[group.slug];
      return {
        id: group.slug,
        title: group.title,
        description: meta.description,
        href: `${contributionsSection.basePath}/${group.slug}`,
        icon: group.icon,
        accentText: meta.accentText,
        iconGradient: meta.iconGradient,
        metadata: [`${group.courses.length} sessions`, "Open to everyone"],
      };
    }),
  },
  processSection: {
    title: "How Public Contributions works",
    description: "No applications, no barriers — just show up and start learning.",
    steps: [
      { title: "Choose an open resource", description: "Pick the learning area that interests you most." },
      { title: "Join or access it", description: "Get in touch and we'll share how to join the session." },
      { title: "Learn", description: "Take part in the session at your own pace." },
      { title: "Continue independently", description: "Keep building on what you've learned after the session ends." },
    ],
  },
  faqSection: {
    title: "Frequently asked questions",
    items: [
      {
        question: "Do I need to pay for these sessions?",
        answer: "No. Public Contributions sessions are completely free and open to anyone who wants to join.",
      },
      {
        question: "Do I need any prior experience?",
        answer: "No. These sessions are designed as an open starting point, with no prerequisites to join.",
      },
      {
        question: "How do I join a session?",
        answer:
          "Select a learning area, choose a session, and get in touch — we'll share the details for joining or accessing it.",
      },
      {
        question: "Can I attend more than one learning area?",
        answer: "Yes. You're welcome to join as many sessions as you'd like, in any order.",
      },
      {
        question: "Is this connected to the paid bootcamps?",
        answer:
          "Public Contributions is separate from the paid bootcamp tracks, though many learners use it as a first step before enrolling in one.",
      },
    ],
  },
  ctaSection: {
    title: "Pick a learning area and join in.",
    description: "Browse what's available in each area and reach out to join a session that fits you.",
    primaryLabel: "Explore learning areas",
    secondaryLabel: "Not sure where to begin?",
    secondaryHref: "/consultations",
  },
};
