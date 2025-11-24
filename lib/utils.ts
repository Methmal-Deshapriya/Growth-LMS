import { clsx, type ClassValue } from "clsx";
import { delay } from "motion";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const advice = [
  {
    id: 1,
    title1: "We start with",
    title2: "nothing",
    description:
      "No prior knowledge nor experience needed — we start from zero. We'll lay the foundation for you.",
    bgclass: "bg-[#5516CC]",
    delay: 0.2,
  },
  {
    id: 2,
    title1: "Show",
    title2: "Consistency",
    description:
      "Actively participate in sessions, complete assignments before deadlines. Rewatch, revise, rethink, and build brand new.",
    bgclass: "bg-[#FF2753]",
    delay: 0.4,
  },
  {
    id: 3,
    title1: "Grow Beyond",
    title2: "Limits",
    description:
      "Keep exploring, experimenting, and learning. Transform your ideas into real-world projects.",
    bgclass: "bg-[#0F0F14]",
    delay: 0.6,
  },
];

export const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];

export const bootcamps = [
  {
    id: 1,
  },
];

export const content = [
  {
    title: "Unlimited 1-1 Persomal Mentorship",
    description:
      "Receive unlimited personalized guidance from expert mentors to help you overcome challenges and accelerate your learning journey.",
  },
  {
    title: "Gamified Lerning with Kahoot",
    description:
      "Engage in interactive quizzes and games with Kahoot to make learning fun, competitive, and more effective.",
  },
  {
    title: "Project Based Learning and Scenario Driven Programming",
    description:
      "Gain real-world experience by solving practical problems and building projects that simulate real-life programming scenarios.",
  },
  {
    title: "Job Search and Career Placement Assistance",
    description:
      "Master web development by designing and developing stunning, responsive websites using the latest technologies and best practices.",
  },
];
