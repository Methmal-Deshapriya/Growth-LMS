"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateBootcampRequest, BootcampAdmin } from "../../bootcampsTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Type,
  Link as LinkIcon,
  DollarSign,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Validation Schema (Matches backend createBootcampSchema)
const SLUG_REGEX = /^[a-z0-9-]+$/;

const bootcampSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z
    .string()
    .regex(SLUG_REGEX, "Slug must be lowercase, numbers, and dashes only"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Price cannot be negative"),
  ),
});

type BootcampFormInput = z.input<typeof bootcampSchema>;
type BootcampFormOutput = z.output<typeof bootcampSchema>;

interface BootcampFormProps {
  initialData?: BootcampAdmin;
  onSubmit: (data: BootcampFormOutput) => Promise<void>;
  isLoading: boolean;
}

/**
 * BootcampForm Component
 *
 * Used for both creating and editing bootcamps.
 * Features automatic slug generation from the title.
 */
export default function BootcampForm({
  initialData,
  onSubmit,
  isLoading,
}: BootcampFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BootcampFormInput, unknown, BootcampFormOutput>({
    resolver: zodResolver(bootcampSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description || "",
          price: initialData.price,
        }
      : {
          title: "",
          slug: "",
          description: "",
          price: 0,
        },
  });

  const watchedTitle = watch("title");

  // --- Auto-generate slug ---
  useEffect(() => {
    // Only auto-generate if we are creating NEW or if slug is empty
    if (!initialData && watchedTitle) {
      const generatedSlug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [watchedTitle, setValue, initialData]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-sm"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Bootcamp Title</Label>
        <div className="relative">
          <Type className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="title"
            placeholder="e.g. Full-Stack Web Engineering"
            className="pl-10"
            error={!!errors.title}
            disabled={isLoading}
            {...register("title")}
          />
        </div>
        {errors.title && (
          <p className="text-xs text-red-500 dark:text-red-400 font-medium">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="slug"
            placeholder="e.g. full-stack-engineering"
            className="pl-10 font-mono text-xs"
            error={!!errors.slug}
            disabled={isLoading}
            {...register("slug")}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          This will be the web address: foundrylms.com/bootcamps/
          <strong>{watch("slug") || "slug"}</strong>
        </p>
        {errors.slug && (
          <p className="text-xs text-red-500 dark:text-red-400 font-medium">
            {errors.slug.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price (LKR)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            className="pl-10"
            error={!!errors.price}
            disabled={isLoading}
            {...register("price")}
          />
        </div>
        {errors.price && (
          <p className="text-xs text-red-500 dark:text-red-400 font-medium">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="relative">
          <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the learning outcomes and target audience..."
            className={cn(
              "flex w-full rounded-md border border-border bg-card px-3 py-2 text-sm pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all",
              errors.description && "border-red-500",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
            disabled={isLoading}
            {...register("description")}
          />
        </div>
        {errors.description && (
          <p className="text-xs text-red-500 dark:text-red-400 font-medium">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : initialData ? (
            "Update Bootcamp"
          ) : (
            "Create Bootcamp"
          )}
        </Button>
      </div>
    </form>
  );
}
