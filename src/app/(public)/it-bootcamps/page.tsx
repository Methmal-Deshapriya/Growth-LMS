"use client";

import React from "react";
import { PublicServicePage } from "@/components/marketing/public-service/PublicServicePage";
import { itBootcampsServiceConfig } from "@/data/publicServices/itBootcamps";

export default function ItBootcampsPage() {
  return <PublicServicePage config={itBootcampsServiceConfig} />;
}
