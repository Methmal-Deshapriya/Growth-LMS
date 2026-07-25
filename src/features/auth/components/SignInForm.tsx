"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "../authApi";
import { LoginRequest } from "../authTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";

// 1. Define Validation Schema (Matches backend logic)
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * SignInForm Component
 * 
 * Handles user login with validation and error feedback.
 */
export default function SignInForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  // 2. Initialize Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Handle Submit
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();
      toast.success("Welcome back to Foundry Academy!");
      // Redirection is handled by GuestGuard automatically because isAuthenticated changes
    } catch (err: any) {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        toast.error("Please verify your email before logging in.");
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        return;
      }
      // Check if it's a normalized field error from our baseApi
      if (err.field) {
        setError(err.field as keyof LoginFormValues, {
          type: "server",
          message: err.message,
        });
      } else {
        toast.error(err.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-500">Access your learning dashboard</p>
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

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              href="/forgot-password" 
              className="text-xs font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              error={!!errors.password}
              disabled={isLoading}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up for free
          </Link>
        </div>
      </form>
    </div>
  );
}
