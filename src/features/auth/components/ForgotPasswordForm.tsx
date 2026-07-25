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
    } catch (err: any) {
      if (err.code === "NOT_FOUND") {
        setError("email", { type: "server", message: err.message });
        setNotRegistered(true);
        return;
      }
      toast.error(err.message || "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md space-y-6 p-8 bg-card rounded-2xl shadow-xl border border-border text-center">
        <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
        <p className="text-muted-foreground">
          We&apos;ve sent a link to reset your password. The link expires in 1 hour.
        </p>
        <Link href="/sign-in" className="font-semibold text-primary hover:text-primary">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-2xl shadow-xl border border-border">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Forgot Password</h2>
        <p className="text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
            <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email.message}</p>
          )}
          {notRegistered && (
            <p className="text-xs text-muted-foreground">
              <Link href="/sign-up" className="font-semibold text-primary hover:text-primary">
                Create an account
              </Link>{" "}
              instead?
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
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

        <div className="text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link href="/sign-in" className="font-semibold text-primary hover:text-primary">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
