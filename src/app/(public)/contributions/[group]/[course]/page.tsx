"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { CourseDetail } from "@/components/marketing/catalog/CourseDetail";
import { contributionsSection } from "@/data/catalog/contributions";

export default function ContributionsCoursePage() {
  const params = useParams();
  const groupSlug = params.group as string;
  const courseSlug = params.course as string;

  const group = contributionsSection.groups.find((g) => g.slug === groupSlug);
  const course = group?.courses.find((c) => c.slug === courseSlug);

  if (!group || !course) return notFound();

  return <CourseDetail section={contributionsSection} group={group} course={course} />;
}
