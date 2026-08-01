import type { LucideIcon } from "lucide-react";

export interface CatalogCourse {
  slug: string;
  title: string;
  summary: string;
  level: string;
  duration: string;
  description: string;
  highlights: string[];
}

export interface CatalogGroup {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  courses: CatalogCourse[];
}

export interface CatalogSection {
  basePath: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  groups: CatalogGroup[];
}
