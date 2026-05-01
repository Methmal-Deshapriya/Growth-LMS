"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetBootcampRosterQuery } from "@/features/enrollments/enrollmentsApi";
import { useGetAdminBootcampsQuery } from "@/features/bootcamps/bootcampsApi";
import ClassRosterTable from "@/features/enrollments/components/ClassRosterTable";
import { Loader2, ChevronLeft, UserX } from "lucide-react";
import Link from "next/link";

/**
 * Bootcamp Roster Page
 * 
 * Displays all students currently enrolled in a specific program.
 */
export default function BootcampRosterPage() {
  const { id } = useParams();
  
  // 1. Fetch roster data
  const { 
    data: roster, 
    isLoading: isLoadingRoster, 
    isError: isErrorRoster 
  } = useGetBootcampRosterQuery(id as string);

  // 2. Fetch bootcamp details for context
  const { 
    data: bootcamps, 
    isLoading: isLoadingBootcamps 
  } = useGetAdminBootcampsQuery();

  const targetBootcamp = bootcamps?.find(b => b.id === id);

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation */}
      <Link 
        href="/admin/bootcamps" 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-2"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Bootcamps
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Roster</h1>
        <p className="text-gray-500 mt-1">
          {isLoadingBootcamps ? (
            "Loading program details..."
          ) : (
            <>Students enrolled in &quot;<span className="font-semibold text-gray-700">{targetBootcamp?.title}</span>&quot;</>
          )}
        </p>
      </div>

      {/* State Handling */}
      {isLoadingRoster ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-medium">Fetching student list...</p>
        </div>
      ) : isErrorRoster ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Error loading roster</h2>
          <p className="text-red-700">
            There was a problem retrieving the student list for this bootcamp.
          </p>
        </div>
      ) : roster && roster.length > 0 ? (
        <ClassRosterTable entries={roster} />
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserX className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No students yet</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            This bootcamp currently has zero enrollments. Once an admin grants access to a student, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
