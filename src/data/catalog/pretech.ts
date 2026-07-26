import { Calculator, Atom, BarChart3, Terminal } from "lucide-react";
import type { CatalogSection } from "@/components/marketing/catalog/types";

/**
 * Dummy catalog data for PreTech — preparing university-bound students
 * (BICT, BBST, BET) with the core modules they'll need.
 */
export const pretechSection: CatalogSection = {
  basePath: "/pretech-courses",
  eyebrow: "PreTech",
  title: "Get ready",
  highlight: "for university",
  subtitle: "Core modules for BICT, BBST and BET — built to prepare you before you start.",
  groups: [
    {
      slug: "maths",
      title: "Maths",
      description: "Mathematics foundations for BICT, BBST and BET.",
      icon: Calculator,
      color: "text-indigo-600 bg-indigo-100",
      courses: [
        {
          slug: "mathematics-1",
          title: "Mathematics 1",
          summary: "Core mathematical foundations for all three degree programs.",
          level: "Foundation",
          duration: "8 weeks",
          description:
            "Covers the foundational mathematics every BICT, BBST and BET student needs before their first year — algebra, functions, and introductory calculus.",
          highlights: [
            "Algebra and functions",
            "Introductory calculus",
            "Problem-solving technique",
            "Worked past-paper style practice",
          ],
        },
        {
          slug: "mathematics-2",
          title: "Mathematics 2",
          summary: "Building on Mathematics 1 with more advanced topics.",
          level: "Foundation",
          duration: "8 weeks",
          description:
            "Continues from Mathematics 1 into further calculus, linear algebra basics, and applied problem sets aligned with first-year coursework.",
          highlights: [
            "Further calculus",
            "Linear algebra basics",
            "Applied problem sets",
            "Exam-style practice",
          ],
        },
      ],
    },
    {
      slug: "physics",
      title: "Physics",
      description: "Physics foundations for BICT, BBST and BET.",
      icon: Atom,
      color: "text-blue-600 bg-blue-100",
      courses: [
        {
          slug: "physics-1",
          title: "Physics 1",
          summary: "Core physics concepts every incoming student should know.",
          level: "Foundation",
          duration: "6 weeks",
          description:
            "An introduction to mechanics, waves, and basic electricity — the physics foundation shared across BICT, BBST and BET.",
          highlights: [
            "Mechanics fundamentals",
            "Waves and oscillations",
            "Intro to electricity",
            "Applied problem solving",
          ],
        },
        {
          slug: "physics-2",
          title: "Physics 2",
          summary: "Continuing into more applied physics topics.",
          level: "Foundation",
          duration: "6 weeks",
          description:
            "Builds on Physics 1 with more applied topics relevant to technology and engineering coursework.",
          highlights: [
            "Electromagnetism basics",
            "Applied physics problems",
            "Lab-style worked examples",
            "Exam-style practice",
          ],
        },
      ],
    },
    {
      slug: "statistics",
      title: "Statistics",
      description: "Statistics foundations for each degree program.",
      icon: BarChart3,
      color: "text-violet-600 bg-violet-100",
      courses: [
        {
          slug: "statistics-1",
          title: "Statistics 1",
          summary: "Foundational statistics and probability.",
          level: "Foundation",
          duration: "6 weeks",
          description:
            "Covers descriptive statistics, probability fundamentals, and how to read and reason about data — the basis for every degree track.",
          highlights: [
            "Descriptive statistics",
            "Probability fundamentals",
            "Data interpretation",
            "Applied exercises",
          ],
        },
        {
          slug: "statistics-2",
          title: "Statistics 2",
          summary: "Extending into inferential statistics.",
          level: "Foundation",
          duration: "6 weeks",
          description:
            "Moves from descriptive to inferential statistics, covering distributions, hypothesis testing basics, and applied problem sets.",
          highlights: [
            "Probability distributions",
            "Intro to hypothesis testing",
            "Applied data problems",
            "Exam-style practice",
          ],
        },
      ],
    },
    {
      slug: "c-programming",
      title: "C Programming",
      description: "C programming foundations for each degree program.",
      icon: Terminal,
      color: "text-teal-600 bg-teal-100",
      courses: [
        {
          slug: "c-programming-1",
          title: "C Programming 1",
          summary: "Your first steps writing real programs in C.",
          level: "Foundation",
          duration: "6 weeks",
          description:
            "An introduction to programming using C — variables, control flow, and functions, with no prior coding experience required.",
          highlights: [
            "Variables, types and control flow",
            "Functions and scope",
            "Arrays and basic pointers",
            "Hands-on coding exercises",
          ],
        },
        {
          slug: "c-programming-2",
          title: "C Programming 2",
          summary: "Deeper into pointers, memory, and structured programs.",
          level: "Foundation",
          duration: "6 weeks",
          description:
            "Builds on C Programming 1 — pointers, memory management, and structuring larger programs, preparing students for first-year coursework.",
          highlights: [
            "Pointers and memory management",
            "Structs and modular programs",
            "File handling basics",
            "Applied coding projects",
          ],
        },
      ],
    },
  ],
};
