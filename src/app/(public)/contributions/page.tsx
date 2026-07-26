"use client";

import React from "react";
import { GroupGrid } from "@/components/marketing/catalog/GroupGrid";
import { contributionsSection } from "@/data/catalog/contributions";

export default function ContributionsPage() {
  return <GroupGrid section={contributionsSection} />;
}
