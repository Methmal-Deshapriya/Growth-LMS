"use client";

import { useParams } from "next/navigation";
import { LegacyCourseRouteRedirect } from "@/features/catalog/components/LegacyCourseRouteRedirect";

export default function LegacyCourseStudentsPage() {
  const { id } = useParams<{ id: string }>();
  return <LegacyCourseRouteRedirect courseId={id} destination="students" />;
}
