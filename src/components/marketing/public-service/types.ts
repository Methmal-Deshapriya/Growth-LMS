import type { LucideIcon } from "lucide-react";

export interface PublicServiceConfig {
  basePath: string;
  breadcrumbLabel: string;

  /** Tailwind classes — the one accent color this service carries throughout. */
  accent: {
    text: string; // e.g. "text-blue-600"
    gradient: string; // e.g. "from-blue-600 to-indigo-500"
    softBg: string; // e.g. "bg-blue-100"
    button: string; // e.g. "bg-blue-600 hover:bg-blue-700"
  };

  hero: {
    eyebrow: string;
    title: string;
    highlight?: string;
    description: string;
    illustration?: { src: string; alt: string };
    indicators: { icon: LucideIcon; label: string }[];
  };

  categorySection: {
    title: string;
    highlight?: string;
    description: string;
    /** Generic word for what the cards represent — "tracks" | "subjects" | "learning areas" */
    itemLabel: string;
    items: {
      id: string;
      title: string;
      description: string;
      href: string;
      icon: LucideIcon;
      accentText: string;
      iconGradient: string;
      badge?: string;
      /** Plain lines only — e.g. ["3 courses", "Beginner to Intermediate"] */
      metadata: string[];
    }[];
  };

  processSection: {
    title: string;
    description: string;
    steps: { title: string; description: string }[];
  };

  faqSection: {
    title: string;
    items: { question: string; answer: string }[];
  };

  ctaSection: {
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
}
