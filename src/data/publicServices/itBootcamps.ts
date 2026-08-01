import { Layers, Sparkles, Compass } from "lucide-react";
import type { PublicServiceConfig } from "@/components/marketing/public-service/types";
import { SERVICE_ACCENT } from "@/components/marketing/public-service/accent";
import { itBootcampsSection } from "@/data/catalog/itBootcamps";

const TRACK_META: Record<string, { description: string; iconGradient: string; accentText: string; badge?: string }> = {
  ai: {
    description: "Understand intelligent systems, reasoning, search, and modern AI applications.",
    iconGradient: "from-violet-500 to-violet-600",
    accentText: "text-violet-600",
    badge: "Popular",
  },
  "machine-learning": {
    description: "Learn how data and algorithms are used to build systems that improve from experience.",
    iconGradient: "from-blue-500 to-blue-600",
    accentText: "text-blue-600",
  },
  "software-engineering": {
    description: "Learn to design and build reliable, production-focused software applications.",
    iconGradient: "from-cyan-500 to-cyan-600",
    accentText: "text-cyan-600",
  },
  devops: {
    description: "Explore the practices and tools used to automate, deliver, and operate software.",
    iconGradient: "from-orange-500 to-orange-600",
    accentText: "text-orange-600",
  },
};

const LEVEL_RANGE: Record<string, string> = {
  ai: "Beginner to Intermediate",
  "machine-learning": "Beginner to Intermediate",
  "software-engineering": "Beginner to Advanced",
  devops: "Beginner to Intermediate",
};

export const itBootcampsServiceConfig: PublicServiceConfig = {
  basePath: itBootcampsSection.basePath,
  breadcrumbLabel: itBootcampsSection.eyebrow,
  accent: SERVICE_ACCENT,
  hero: {
    eyebrow: "IT Professional Bootcamps",
    title: "Build practical skills for the",
    highlight: "technology industry",
    description:
      "Explore structured learning pathways designed to help you understand core concepts, practise relevant skills, and build real projects.",
    illustration: {
      src: "/assets/bootcamps-hero.png",
      alt: "Illustration of a laptop with code and app icons, representing IT bootcamps",
    },
    indicators: [
      { icon: Layers, label: "4 learning tracks" },
      { icon: Sparkles, label: "Practical learning" },
      { icon: Compass, label: "Beginner-friendly pathways" },
    ],
  },
  categorySection: {
    title: "Choose your",
    highlight: "career path",
    description: "Start with the field that matches what you want to understand, create, or work toward.",
    itemLabel: "tracks",
    items: itBootcampsSection.groups.map((group) => {
      const meta = TRACK_META[group.slug];
      return {
        id: group.slug,
        title: group.title,
        description: meta.description,
        href: `${itBootcampsSection.basePath}/${group.slug}`,
        icon: group.icon,
        accentText: meta.accentText,
        iconGradient: meta.iconGradient,
        badge: meta.badge,
        metadata: [`${group.courses.length} courses`, LEVEL_RANGE[group.slug]],
      };
    }),
  },
  processSection: {
    title: "How the bootcamps work",
    description: "A clear learning process that moves from understanding concepts to applying them.",
    steps: [
      { title: "Choose a path", description: "Select a field based on what you want to learn or create." },
      { title: "Learn the foundations", description: "Build a clear understanding of the important concepts." },
      { title: "Practise", description: "Apply what you learn through guided activities and exercises." },
      { title: "Build", description: "Use your knowledge in practical tasks and projects." },
    ],
  },
  faqSection: {
    title: "Frequently asked questions",
    items: [
      {
        question: "Do I need previous experience?",
        answer:
          "Some courses are designed for complete beginners, while others require foundational knowledge. Each course page clearly shows its level and prerequisites.",
      },
      {
        question: "How do I choose the correct learning track?",
        answer:
          "Start with what you want to create or understand. Software Engineering focuses on building applications, Machine Learning focuses on systems that learn from data, Artificial Intelligence covers broader intelligent systems, and DevOps focuses on software delivery and operations.",
      },
      {
        question: "Are the bootcamps practical?",
        answer:
          "Yes. The pathways combine conceptual learning with guided exercises, practical activities, and project-focused work.",
      },
      {
        question: "Can I follow more than one track?",
        answer:
          "Yes. The tracks are connected, and learners may continue into another pathway after building the necessary foundations.",
      },
      {
        question: "How long does a course take?",
        answer:
          "Course duration varies. The expected duration and learning level are shown on each individual course page.",
      },
    ],
  },
  ctaSection: {
    title: "Choose one direction and start exploring.",
    description:
      "You can compare the available courses inside each pathway and begin at the level that matches your current experience.",
    primaryLabel: "Explore bootcamp tracks",
    secondaryLabel: "Not sure where to begin?",
    secondaryHref: "/consultations",
  },
};
