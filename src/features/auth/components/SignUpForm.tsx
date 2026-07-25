"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "../authApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DISTRICTS, AL_STREAMS } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// 1. Define Validation Schema (Matches backend registerSchema + confirm password)
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .regex(/^0\d{9}$/, "Invalid Sri Lankan phone number format (e.g., 0757451258)"),
    address: z.string().min(1, "Address is required"),
    district: z.enum(DISTRICTS, { message: "Please select a district" }),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    alStream: z.enum(AL_STREAMS, { message: "Please select an A/L stream" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Shared styling to give inputs/selects the taller, more rounded, softer
// look (overrides the Input component's defaults via class-merging).
const inputClassName = "h-12 rounded-xl border-input bg-muted/50 px-4";

// Native <select> — no Select component exists in this project yet, so
// this mirrors the Input styling above plus the error-state pattern used
// elsewhere (e.g. src/app/(dashboard)/admin/users/page.tsx).
const selectClassName =
  "flex h-12 w-full rounded-xl border border-input bg-muted/50 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const selectErrorClassName = "border-red-500 dark:border-red-500 focus-visible:ring-red-500 dark:focus-visible:ring-red-400";

/**
 * SignUpForm Component
 *
 * Handles user registration (all 10 required fields) with validation and
 * error feedback, in a split-panel layout: form on the left, Foundry
 * branding on the right (hidden on small screens).
 */
export default function SignUpForm() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();

  // 2. Initialize Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      district: undefined,
      dateOfBirth: "",
      alStream: undefined,
    },
  });

  // 3. Handle Submit
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // Send only the fields the backend expects (drop confirmPassword)
      const { confirmPassword: _confirmPassword, ...payload } = values;

      await registerUser(payload).unwrap();
      toast.success("Account created! Check your email for a verification code.");
      // Registering does not log the user in — they must verify their
      // email via OTP first, so we redirect explicitly rather than
      // relying on GuestGuard's isAuthenticated-driven redirect.
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      // Check if it's a normalized field error from our baseApi
      if (err.field) {
        setError(err.field as any, {
          type: "server",
          message: err.message,
        });
      } else {
        toast.error(err.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Image src="/assets/logo.png" alt="Foundry Academy" width={120} height={120} />
          </Link>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground">Start your journey with Foundry Academy</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  className={inputClassName}
                  error={!!errors.firstName}
                  disabled={isLoading}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className={inputClassName}
                  error={!!errors.lastName}
                  disabled={isLoading}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.lastName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0771234567"
                  className={inputClassName}
                  error={!!errors.phone}
                  disabled={isLoading}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className={inputClassName}
                  error={!!errors.dateOfBirth}
                  disabled={isLoading}
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <select
                  id="district"
                  className={
                    selectClassName + (errors.district ? ` ${selectErrorClassName}` : "")
                  }
                  disabled={isLoading}
                  defaultValue=""
                  {...register("district")}
                >
                  <option value="" disabled>
                    Select district
                  </option>
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.district.message}</p>
                )}
              </div>

              {/* AL Stream */}
              <div className="space-y-2">
                <Label htmlFor="alStream">A/L Stream</Label>
                <select
                  id="alStream"
                  className={
                    selectClassName + (errors.alStream ? ` ${selectErrorClassName}` : "")
                  }
                  disabled={isLoading}
                  defaultValue=""
                  {...register("alStream")}
                >
                  <option value="" disabled>
                    Select A/L stream
                  </option>
                  {AL_STREAMS.map((stream) => (
                    <option key={stream} value={stream}>
                      {stream}
                    </option>
                  ))}
                </select>
                {errors.alStream && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.alStream.message}</p>
                )}
              </div>

              {/* Address (full width) */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main Street, Colombo"
                  className={inputClassName}
                  error={!!errors.address}
                  disabled={isLoading}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.address.message}</p>
                )}
              </div>

              {/* Email (full width) */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={inputClassName}
                  error={!!errors.email}
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={inputClassName}
                  error={!!errors.password}
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={inputClassName}
                  error={!!errors.confirmPassword}
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-primary hover:text-primary/80">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel — Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-background p-6">
        <div className="w-full h-full rounded-4xl bg-primary shadow-xl flex items-center justify-center p-12">
          <div className="max-w-md text-white space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Become job-ready in AI, Full-Stack &amp; Cybersecurity
            </h1>
            <p className="text-blue-100 text-lg">
              Join Foundry Academy&apos;s practical bootcamps — real projects, expert mentorship,
              and a clear path into tech careers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
