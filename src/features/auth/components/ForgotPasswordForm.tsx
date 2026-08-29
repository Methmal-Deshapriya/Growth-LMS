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
import { Loader2, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { isNormalizedApiError } from "@/lib/api";

// 1. Define Validation Schema (Matches backend forgotPasswordSchema)
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Matches SignUpForm/SignInForm's input styling so all auth forms look
// like one consistent family instead of a mix of card and non-card forms.
const inputClassName =
  "h-12 rounded-xl border-input bg-muted/50 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary";

/**
 * ForgotPasswordForm Component
 *
 * Requests a password reset email. Deliberately reveals whether the email
 * is registered (product choice favoring UX over enumeration-hardening) —
 * an unregistered email surfaces as an inline field error with a sign-up
 * link, instead of the generic "check your email" screen.
 */
export default function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setNotRegistered(false);

    try {
      await forgotPassword(data).unwrap();
    } catch (error: unknown) {
      if (isNormalizedApiError(error) && error.code === "NOT_FOUND") {
        setError("email", { type: "server", message: error.message });
        setNotRegistered(true);
        return;
      }
      toast.error(
        isNormalizedApiError(error)
          ? error.message
          : "Something went wrong. Please try again.",
      );
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md space-y-4 text-center">
        <h2 className="font-sans text-3xl font-bold text-[#0E1116]">Check your email</h2>
        <p className="font-alt text-[#5B6472]">
          We&apos;ve sent a link to reset your password. The link expires in 1 hour.
        </p>
        <Link
          href="/?slide=auth&authView=sign-in"
          className="inline-block font-semibold text-primary hover:text-primary/80"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h2 className="font-sans text-3xl font-bold text-[#0E1116]">Forgot Password</h2>
        <p className="font-alt text-[#5B6472]">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Email Field */}
        <div className="space-y-4">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={inputClassName}
              error={!!errors.email}
              disabled={isLoading}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
          )}
          {notRegistered && (
            <p className="text-xs text-muted-foreground">
              <Link href="/?slide=auth&authView=sign-up" className="font-semibold text-primary hover:text-primary/80">
                Create an account
              </Link>{" "}
              instead?
            </p>
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
              Sending link...
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link href="/?slide=auth&authView=sign-in" className="font-semibold text-primary hover:text-primary/80">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
