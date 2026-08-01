import { Code2, GitBranch, Globe, Languages } from "lucide-react";
import type { CatalogSection } from "@/components/marketing/catalog/types";

/**
 * Dummy catalog data for Public Contributions — open foundational sessions
 * for anyone looking to build the basics every tech career rests on.
 */
export const contributionsSection: CatalogSection = {
  basePath: "/contributions",
  eyebrow: "Public Contributions",
  title: "Open",
  highlight: "foundational sessions",
  subtitle: "Free, open sessions on the basics every tech career rests on.",
  groups: [
    {
      slug: "software-engineering-fundamentals",
      title: "Software Engineering Fundamentals",
      description: "The core thinking behind writing good software.",
      icon: Code2,
      color: "text-blue-600 bg-blue-100",
      courses: [
        {
          slug: "intro-to-software-engineering",
          title: "Intro to Software Engineering",
          summary: "What software engineering actually is, day to day.",
          level: "Open",
          duration: "1 session",
          description:
            "A free introductory session covering what software engineering looks like in practice — how teams build, ship, and maintain software.",
          highlights: [
            "How software gets built in the real world",
            "Common roles and workflows",
            "Where to start learning",
            "Open Q&A",
          ],
        },
        {
          slug: "problem-solving-and-algorithms",
          title: "Problem Solving & Algorithms",
          summary: "Thinking like a programmer before writing code.",
          level: "Open",
          duration: "2 sessions",
          description:
            "Covers the fundamentals of breaking problems down and reasoning about solutions before ever touching a specific language.",
          highlights: [
            "Breaking problems into steps",
            "Intro to algorithmic thinking",
            "Practice problems",
            "Open Q&A",
          ],
        },
      ],
    },
    {
      slug: "git-github",
      title: "Git & GitHub",
      description: "Version control, the way real teams use it.",
      icon: GitBranch,
      color: "text-rose-600 bg-rose-100",
      courses: [
        {
          slug: "git-fundamentals",
          title: "Git Fundamentals",
          summary: "Tracking changes and working with version control.",
          level: "Open",
          duration: "1 session",
          description:
            "A hands-on session on Git basics — commits, branches, and the everyday workflow used across almost every real project.",
          highlights: [
            "Commits and history",
            "Branching basics",
            "Everyday Git workflow",
            "Open Q&A",
          ],
        },
        {
          slug: "collaborating-with-github",
          title: "Collaborating with GitHub",
          summary: "Working with others on shared codebases.",
          level: "Open",
          duration: "1 session",
          description:
            "Covers collaborating on GitHub — pull requests, code review, and the conventions teams use to work together smoothly.",
          highlights: [
            "Pull requests and code review",
            "Working with remote repositories",
            "Team collaboration conventions",
            "Open Q&A",
          ],
        },
      ],
    },
    {
      slug: "general-knowledge",
      title: "General Knowledge",
      description: "Broad awareness sessions open to anyone.",
      icon: Globe,
      color: "text-emerald-600 bg-emerald-100",
      courses: [
        {
          slug: "general-knowledge-basics",
          title: "General Knowledge Basics",
          summary: "A broad-based general knowledge session.",
          level: "Open",
          duration: "1 session",
          description:
            "An open session covering general awareness topics that come up often in interviews and everyday conversation.",
          highlights: ["Broad topic coverage", "Interactive discussion", "Open Q&A"],
        },
        {
          slug: "current-affairs-and-awareness",
          title: "Current Affairs & Awareness",
          summary: "Staying informed and building broader awareness.",
          level: "Open",
          duration: "1 session",
          description:
            "Focused on building the habit of staying informed and discussing current topics constructively.",
          highlights: ["Current affairs discussion", "Building the habit of staying informed", "Open Q&A"],
        },
      ],
    },
    {
      slug: "general-english",
      title: "General English",
      description: "Communication skills for study and work.",
      icon: Languages,
      color: "text-amber-600 bg-amber-100",
      courses: [
        {
          slug: "english-for-communication",
          title: "English for Communication",
          summary: "Everyday spoken and written communication skills.",
          level: "Open",
          duration: "2 sessions",
          description:
            "Focused on practical communication skills — speaking with confidence and writing clearly in everyday and academic contexts.",
          highlights: ["Spoken communication practice", "Everyday writing skills", "Open Q&A"],
        },
        {
          slug: "technical-english-writing",
          title: "Technical English Writing",
          summary: "Writing clearly for reports, docs, and academic work.",
          level: "Open",
          duration: "1 session",
          description:
            "Covers writing clearly and precisely for technical and academic contexts — reports, documentation, and coursework.",
          highlights: ["Clear technical writing", "Structuring reports", "Open Q&A"],
        },
      ],
    },
  ],
};
