"use client";

import React from "react";
import { PublicServicePage } from "@/components/marketing/public-service/PublicServicePage";
import { pretechServiceConfig } from "@/data/publicServices/pretech";

export default function PretechCoursesPage() {
  return <PublicServicePage config={pretechServiceConfig} />;
}
