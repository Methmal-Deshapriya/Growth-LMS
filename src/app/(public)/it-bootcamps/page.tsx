"use client";

import React from "react";
import { GroupGrid } from "@/components/marketing/catalog/GroupGrid";
import { itBootcampsSection } from "@/data/catalog/itBootcamps";

export default function ItBootcampsPage() {
  return <GroupGrid section={itBootcampsSection} />;
}
