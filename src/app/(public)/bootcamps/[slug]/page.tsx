"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { useGetBootcampBySlugQuery } from "@/features/bootcamps/bootcampsApi";
import Hero from "@/features/bootcamps/components/public/detail/Hero";
import CourseDescription from "@/features/bootcamps/components/public/detail/CourseDescription";
import Curriculum from "@/features/bootcamps/components/public/detail/Curriculum";
import ForWho from "@/features/bootcamps/components/public/detail/ForWho";
import Certificate from "@/features/bootcamps/components/public/detail/Certificate";
import PriceDetails from "@/features/bootcamps/components/public/detail/PriceDetails";
import IntroVideo from "@/features/bootcamps/components/public/detail/IntroVideo";
import { courses } from "@/data/courses";
import { Loader2 } from "lucide-react";
/**
 * Hybrid Bootcamp Detail Page
 *
 * Drives core content from the live API (title, description, price)
 * while enriching it with rich static data (curriculum, videos, etc.) where available.
 */
export default function CoursePage() {
  const params = useParams();
  const slug = params.slug as string;

  // 1. Fetch live data from backend
  const {
    data: bootcamp,
    isLoading,
    isError,
  } = useGetBootcampBySlugQuery(slug);

  // 2. Resolve static enrichment data
  const staticCourse = courses[slug as keyof typeof courses];

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading program details...</p>
      </div>
    );
  }

  // --- Not Found / Error State ---
  if (isError || !bootcamp) {
    notFound();
  }

  // --- Render Hybrid View ---
  return (
    <div className="md:w-[80vw] lg:w-[70vw] flex flex-col items-center pb-20">
      {/* 1. Hero: Use live title if static data is missing, otherwise merge */}
      <Hero
        hero_title={bootcamp.title}
        hero_ImageURL={
          staticCourse?.hero_data.hero_ImageURL || "/assets/logo.png"
        }
        hero_duration={staticCourse?.hero_data.hero_duration || "12 Weeks"}
        hero_learningHours={
          staticCourse?.hero_data.hero_learningHours || "60+ Hours"
        }
        theme={staticCourse?.hero_data.theme}
      />

      {/* 2. Course Description: Use live description if available */}
      <CourseDescription
        courseDescription_headline_duration={
          staticCourse?.courseDescription_data
            .courseDescription_headline_duration || "12 Weeks"
        }
        courseDescription_headline_persuational={
          staticCourse?.courseDescription_data
            .courseDescription_headline_persuational || "future of technology"
        }
        courseDescription_description={
          bootcamp.description ||
          staticCourse?.courseDescription_data.courseDescription_description ||
          "Master these industry-leading skills."
        }
        theme={staticCourse?.courseDescription_data.theme}
      />

      {/* 3. Rich Marketing Sections: Render only if static data exists */}
      {staticCourse?.introVideo_data && (
        <IntroVideo {...staticCourse.introVideo_data} />
      )}

      {staticCourse?.curriculum_data && (
        <Curriculum {...staticCourse.curriculum_data} />
      )}

      {staticCourse?.forWho_data && <ForWho {...staticCourse.forWho_data} />}

      {staticCourse?.certificate_data && (
        <Certificate {...staticCourse.certificate_data} />
      )}

      {/* 4. Price Details: Always use live price from API */}
      <PriceDetails
        priceDetails_title_1={bootcamp.title}
        priceDetails_title_2="Certification Program"
        priceDetails_benefits={
          staticCourse?.priceDetails_data.priceDetails_benefits || [
            "Lifetime Access",
            "Certificate of Completion",
            "Direct Mentorship",
            "Project-based Learning",
          ]
        }
        priceDetails_price={`LKR ${bootcamp.price.toLocaleString()}`}
      />
    </div>
  );
}
