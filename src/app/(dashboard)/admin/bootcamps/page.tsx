"use client";

import React from "react";
import { useGetAdminBootcampsQuery } from "@/features/bootcamps/bootcampsApi";
import BootcampTable from "@/features/bootcamps/components/admin/BootcampTable";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, LayoutGrid } from "lucide-react";
import Link from "next/link";

/**
 * Admin Bootcamp Management Page
 * 
 * Lists all bootcamps for administration and provides access to CRUD actions.
 */
export default function AdminBootcampsPage() {
  const { data: bootcamps, isLoading, isError } = useGetAdminBootcampsQuery();

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Bootcamps</h1>
          <p className="text-gray-500 mt-1">
            Create, update, and publish your course offerings.
          </p>
        </div>

        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-blue-100">
          <Link href="/admin/bootcamps/new">
            <Plus className="mr-2 h-5 w-5" />
            New Bootcamp
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-medium">Fetching programs...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to load bootcamps</h2>
          <p className="text-red-700 mb-6">
            There was an error connecting to the management service.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : bootcamps && bootcamps.length > 0 ? (
        <BootcampTable bootcamps={bootcamps} />
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No bootcamps yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Your platform is empty. Create your first bootcamp program to get started.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg rounded-xl">
            <Link href="/admin/bootcamps/new">
              Create First Bootcamp
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
