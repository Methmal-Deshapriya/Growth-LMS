"use client";

import React from "react";
import { PublicServicePage } from "@/components/marketing/public-service/PublicServicePage";
import { contributionsServiceConfig } from "@/data/publicServices/contributions";

export default function ContributionsPage() {
  return <PublicServicePage config={contributionsServiceConfig} />;
}
