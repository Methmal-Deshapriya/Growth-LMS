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
    title: "Full Stack Developer",
    salary: "LKR 250,000 – 550,000+ /month",
    description:
      "Builds both the client-side (front-end) and server-side (back-end) of web applications, ensuring the entire system works seamlessly from user interface to database.",
  },
  {
    title: "AI & Machine Learning Engineer",
    salary: "LKR 300,000 – 700,000+ /month",
    description:
      "Designs and deploys intelligent algorithms and models that allow computers to learn from data, make predictions, and solve complex problems without explicit programming.",
  },
  {
    title: "Data Scientist",
    salary: "LKR 250,000 – 600,000+ /month",
    description:
      "Analyzes large, complex datasets to extract actionable insights and trends, using statistical methods and programming to help organizations make data-driven decisions.",
  },
  {
    title: "DevOps Engineer",
    salary: "LKR 350,000 – 800,000+ /month",
    description:
      "Bridges the gap between software development and IT operations, automating deployment pipelines and managing cloud infrastructure to ensure faster and more reliable software releases.",
  },
  {
    title: "Cybersecurity Analyst",
    salary: "LKR 220,000 – 500,000+ /month",
    description:
      "Protects an organization’s computer systems and networks from cyber threats, monitoring for security breaches, identifying vulnerabilities, and implementing robust defenses.",
  },
  {
    title: "UI/UX Designer",
    salary: "LKR 180,000 – 400,000+ /month",
    description:
      "Designs intuitive and visually appealing digital interfaces, focusing on user behavior and research to create products that are easy to use and enjoyable.",
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
