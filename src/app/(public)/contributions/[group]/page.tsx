"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { CourseGrid } from "@/components/marketing/catalog/CourseGrid";
import { contributionsSection } from "@/data/catalog/contributions";

export default function ContributionsGroupPage() {
  const params = useParams();
  const groupSlug = params.group as string;
  const group = contributionsSection.groups.find((g) => g.slug === groupSlug);

  if (!group) return notFound();

  return <CourseGrid section={contributionsSection} group={group} />;
}
