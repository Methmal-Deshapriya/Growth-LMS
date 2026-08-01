"use client";

import React from "react";
import { PageSlide } from "../catalog/PageSlide";
import { CATALOG_GRADIENT_BG } from "../catalog/background";
import { ServiceHero } from "./ServiceHero";
import { ServiceCategoryGrid } from "./ServiceCategoryGrid";
import { ServiceProcess } from "./ServiceProcess";
import { ServiceFaq } from "./ServiceFaq";
import { ServiceCta } from "./ServiceCta";
import type { PublicServiceConfig } from "./types";

/**
 * PublicServicePage
 *
 * Shared Level-2 page shell: Hero → Categories → How it works → FAQ → CTA.
 * Reuses PageSlide for the breadcrumb/back-button/scroll chrome already
 * established for every non-home public page — only the five sections
 * below vary per service, driven entirely by `config`.
 */
export function PublicServicePage({ config }: { config: PublicServiceConfig }) {
  return (
    <PageSlide
      background={CATALOG_GRADIENT_BG}
      backHref="/?slide=services"
      backLabel="Home"
      crumbs={[
        { label: "Home", href: "/?slide=services" },
        { label: config.breadcrumbLabel, href: config.basePath, current: true },
      ]}
    >
      <div className="w-full max-w-6xl mx-auto px-2">
        <ServiceHero hero={config.hero} accent={config.accent} />
        <ServiceCategoryGrid categorySection={config.categorySection} accent={config.accent} />
        <ServiceProcess processSection={config.processSection} accent={config.accent} />
        <ServiceFaq faqSection={config.faqSection} accent={config.accent} />
        <ServiceCta ctaSection={config.ctaSection} accent={config.accent} />
      </div>
    </PageSlide>
  );
}
