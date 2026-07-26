"use client";

import React from "react";
import { GroupGrid } from "@/components/marketing/catalog/GroupGrid";
import { pretechSection } from "@/data/catalog/pretech";

export default function PretechCoursesPage() {
  return <GroupGrid section={pretechSection} />;
}
