"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "../authApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

// 1. Define Validation Schema (Matches backend forgotPasswordSchema)
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * ForgotPasswordForm Component
 *
 * Requests a password reset email. Always shows the same generic success
 * message, whether or not the email is registered, to match the backend's
 * enumeration-safe response.
 */
export default function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data).unwrap();
    } catch (err: any) {
      // Even on an unexpected error, don't reveal anything about the
      // email's registration status — just let the user know something
      // went wrong and they can try again.
      toast.error(err.message || "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-500">
          If that email is registered, we&apos;ve sent a link to reset your password.
          The link expires in 1 hour.
        </p>
        <Link href="/sign-in" className="font-semibold text-blue-600 hover:text-blue-500">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-gray-500">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10"
              error={!!errors.email}
              disabled={isLoading}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link href="/sign-in" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
