"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "../authApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { isNormalizedApiError } from "@/lib/api";

// 1. Define Validation Schema (Matches backend resetPasswordSchema + confirm password)
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        "Password must not exceed 72 UTF-8 bytes",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Matches SignUpForm/SignInForm's input styling so all auth forms look
// like one consistent family instead of a mix of card and non-card forms.
const inputClassName =
  "h-12 rounded-xl border-input bg-muted/50 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary";

/**
 * ResetPasswordForm Component
 *
 * Sets a new password using the token from the emailed reset link.
 * Reads `?token=` from the URL; if it's missing, the link was mistyped
 * or already used up, so the form is replaced with an explanatory message.
 */
export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    try {
      await resetPassword({ token, newPassword: values.newPassword }).unwrap();
      toast.success("Password reset successful. Please sign in.");
      router.push("/?slide=auth&authView=sign-in");
    } catch (error: unknown) {
      if (isNormalizedApiError(error) && error.field) {
        const field =
          error.field === "newPassword" ? "newPassword" : "confirmPassword";
        setError(field, {
          type: "server",
          message: error.message,
        });
      } else {
        toast.error(
          isNormalizedApiError(error)
            ? error.message
            : "Something went wrong. Please try again.",
        );
      }
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-4 text-center">
        <h2 className="font-sans text-3xl font-bold text-[#0E1116]">Invalid reset link</h2>
        <p className="font-alt text-[#5B6472]">
          This password reset link is missing or invalid. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block font-semibold text-primary hover:text-primary/80"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h2 className="font-sans text-3xl font-bold text-[#0E1116]">Reset Password</h2>
        <p className="font-alt text-[#5B6472]">Choose a new password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* New Password Field */}
        <div className="space-y-4">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className={inputClassName}
              error={!!errors.newPassword}
              disabled={isLoading}
              {...register("newPassword")}
            />
          </div>
          {errors.newPassword && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-4">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={inputClassName}
              error={!!errors.confirmPassword}
              disabled={isLoading}
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-full bg-linear-to-r from-blue-600 to-indigo-500 hover:opacity-90 text-white mt-6 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            <>
              Reset Password
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
