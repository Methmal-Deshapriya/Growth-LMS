"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetAdminBootcampsQuery } from "@/features/bootcamps/bootcampsApi";
import SessionManager from "@/features/sessions/components/admin/SessionManager";
import { Loader2, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Admin Session Management Page
 * 
 * Main container for managing sessions of a specific bootcamp.
 */
export default function AdminSessionsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: bootcamps, isLoading } = useGetAdminBootcampsQuery();
  const bootcamp = bootcamps?.find(b => b.id === id);

  if (isLoading) {
    return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto h-8 w-8 text-primary" /></div>;
  }

  if (!bootcamp) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">Bootcamp not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/bootcamps">Back to Bootcamps</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/admin/bootcamps">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-1">
            <BookOpen className="h-3.5 w-3.5" />
            Curriculum Management
          </div>
          <h1 className="text-3xl font-bold text-foreground">{bootcamp.title}</h1>
        </div>
      </div>

      {/* Main Component */}
      <SessionManager bootcampId={id} />
    </div>
  );
}
