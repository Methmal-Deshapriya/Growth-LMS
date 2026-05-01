"use client";

import React from "react";
import { useGetBootcampsQuery } from "@/features/bootcamps/bootcampsApi";
import BootcampGrid from "@/features/bootcamps/components/public/BootcampGrid";
import { Loader2, Search } from "lucide-react";

/**
 * Public Bootcamp Listing Page
 * 
 * Fetches and displays all published bootcamps from the backend.
 */
export default function BootcampsPage() {
  const { data: bootcamps, isLoading, isError, error } = useGetBootcampsQuery();

  return (
    <div className="w-full bg-white pb-24">
      {/* Page Hero */}
      <div className="bg-gray-50 border-b border-gray-100 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Master the Future of <span className="text-blue-600">Technology</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practical, industry-led bootcamps designed to take you from zero to job-ready.
            Start your transformation today.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* State Handling */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Discovering latest programs...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-700">
              We couldn&apos;t load the bootcamps right now. Please check your connection and try again.
            </p>
          </div>
        ) : bootcamps && bootcamps.length > 0 ? (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Programs ({bootcamps.length})
              </h2>
            </div>
            <BootcampGrid bootcamps={bootcamps} />
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-20 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No bootcamps found</h2>
            <p className="text-gray-500">
              Check back soon! We are currently preparing new and exciting programs for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
