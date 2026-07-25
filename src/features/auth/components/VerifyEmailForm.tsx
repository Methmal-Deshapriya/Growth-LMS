"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyOtpMutation, useResendOtpMutation } from "../authApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import Link from "next/link";

// 1. Define Validation Schema (Matches backend verifyOtpSchema)
const verifyOtpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

const RESEND_COOLDOWN_SECONDS = 60;

/**
 * VerifyEmailForm Component
 *
 * Verifies a newly registered email with a 6-digit OTP. This is the
 * actual login moment for a freshly registered account — success sets
 * the auth cookie server-side and redirects to the dashboard.
 */
export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (values: VerifyOtpFormValues) => {
    if (!email) return;

    try {
      await verifyOtp({ email, code: values.code }).unwrap();
      toast.success("Email verified! Welcome to Foundry Academy.");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.field) {
        setError(err.field as keyof VerifyOtpFormValues, {
          type: "server",
          message: err.message,
        });
      } else {
        toast.error(err.message || "Verification failed. Please try again.");
      }
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    try {
      await resendOtp({ email }).unwrap();
      toast.success("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  if (!email) {
    return (
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Missing email</h2>
        <p className="text-gray-500">
          We couldn&apos;t tell which account to verify. Please sign up again.
        </p>
        <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500">
          Back to sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-500">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="pl-10 tracking-[0.3em] text-center"
              error={!!errors.code}
              disabled={isVerifying}
              {...register("code")}
            />
          </div>
          {errors.code && (
            <p className="text-xs font-medium text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="font-semibold text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
