"use client";

import React from "react";
import Link from "next/link";
import { Bootcamp } from "../../bootcampsTypes";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";

interface BootcampCardProps {
  bootcamp: Bootcamp;
}

/**
 * BootcampCard Component
 *
 * Displays a summary of a bootcamp for the public marketplace.
 */
export default function BootcampCard({ bootcamp }: BootcampCardProps) {
  // Since backend doesn't provide duration yet, we'll use a placeholder
  // that we can later update when the API supports it.
  const placeholderDuration = "12 Weeks";

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      {/* Visual Header / Thumbnail Placeholder */}
      <div className="h-48 w-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-6 text-white group-hover:scale-105 transition-transform duration-500">
        <GraduationCap className="h-20 w-20 opacity-20 absolute" />
        <h3 className="text-2xl font-bold text-center z-10 leading-tight">
          {bootcamp.title}
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-col grow p-6">
        <div className="flex items-center gap-4 text-xs font-semibold text-blue-600 mb-4">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5" />
            {placeholderDuration}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="uppercase tracking-wider">Certified</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6 grow">
          {bootcamp.description ||
            "Take your skills to the next level with our professional-grade bootcamp program."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase">
              Price
            </span>
            <span className="text-xl font-bold text-gray-900">
              LKR {bootcamp.price.toLocaleString()}
            </span>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Link href={`/bootcamps/${bootcamp.slug}`}>
              Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
