"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { CourseGrid } from "@/components/marketing/catalog/CourseGrid";
import { itBootcampsSection } from "@/data/catalog/itBootcamps";

export default function ItBootcampGroupPage() {
  const params = useParams();
  const groupSlug = params.group as string;
  const group = itBootcampsSection.groups.find((g) => g.slug === groupSlug);

  if (!group) return notFound();

  return <CourseGrid section={itBootcampsSection} group={group} />;
}
