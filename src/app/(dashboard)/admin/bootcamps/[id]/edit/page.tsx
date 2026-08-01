"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetAdminBootcampsQuery, useUpdateBootcampMutation } from "@/features/bootcamps/bootcampsApi";
import BootcampForm from "@/features/bootcamps/components/admin/BootcampForm";
import type { BootcampFormValues } from "@/features/bootcamps/components/admin/BootcampForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api";

/**
 * Edit Bootcamp Page
 * 
 * Allows admins to update the metadata of an existing bootcamp.
 */
export default function EditBootcampPage() {
  const router = useRouter();
  const { id } = useParams();
  
  // We use the full admin list and find the specific one for speed
  // (Alternatively we could add a getAdminBootcampById endpoint if needed)
  const { data: bootcamps, isLoading: isFetching } = useGetAdminBootcampsQuery();
  const [updateBootcamp, { isLoading: isUpdating }] = useUpdateBootcampMutation();

  const targetBootcamp = bootcamps?.find(b => b.id === id);

  const handleUpdate = async (data: BootcampFormValues) => {
    try {
      await updateBootcamp({ id: id as string, body: data }).unwrap();
      toast.success("Bootcamp updated successfully");
      router.push("/admin/bootcamps");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update bootcamp"));
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading bootcamp data...</p>
      </div>
    );
  }

  if (!targetBootcamp) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-foreground">Bootcamp not found</h2>
        <Link href="/admin/bootcamps" className="text-primary hover:underline mt-4 inline-block">
          Return to list
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Navigation */}
      <Link 
        href="/admin/bootcamps" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to List
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Edit Bootcamp</h1>
        <p className="text-muted-foreground mt-1">
          Update the information for &quot;{targetBootcamp.title}&quot;
        </p>
      </div>

      <BootcampForm 
        initialData={targetBootcamp} 
        onSubmit={handleUpdate} 
        isLoading={isUpdating} 
      />
    </div>
  );
}
