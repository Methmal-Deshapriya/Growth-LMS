"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { CourseGrid } from "@/components/marketing/catalog/CourseGrid";
import { pretechSection } from "@/data/catalog/pretech";

export default function PretechGroupPage() {
  const params = useParams();
  const groupSlug = params.group as string;
  const group = pretechSection.groups.find((g) => g.slug === groupSlug);

  if (!group) return notFound();

  return <CourseGrid section={pretechSection} group={group} />;
}
