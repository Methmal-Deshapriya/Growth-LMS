"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateBootcampMutation } from "@/features/bootcamps/bootcampsApi";
import BootcampForm from "@/features/bootcamps/components/admin/BootcampForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Create Bootcamp Page
 * 
 * Provides the interface for admins to add a new bootcamp to the system.
 */
export default function CreateBootcampPage() {
  const router = useRouter();
  const [createBootcamp, { isLoading }] = useCreateBootcampMutation();

  const handleCreate = async (data: any) => {
    try {
      await createBootcamp(data).unwrap();
      toast.success("Bootcamp created successfully as a draft.");
      router.push("/admin/bootcamps");
    } catch (err: any) {
      toast.error(err.message || "Failed to create bootcamp");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Navigation */}
      <Link 
        href="/admin/bootcamps" 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to List
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">New Bootcamp</h1>
        <p className="text-gray-500 mt-1">
          Fill in the details to launch a new professional program.
        </p>
      </div>

      <BootcampForm onSubmit={handleCreate} isLoading={isLoading} />
    </div>
  );
}
