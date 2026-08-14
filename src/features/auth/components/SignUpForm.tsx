"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "../authApi";
import type { RegisterRequest } from "../authTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DISTRICTS, AL_STREAMS } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2, User, Phone, MapPin, GraduationCap, Home, Mail, Lock, ArrowRight } from "lucide-react";
import { isNormalizedApiError } from "@/lib/api";

// 1. Define Validation Schema (Matches backend registerSchema + confirm password)
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        "Password must not exceed 72 UTF-8 bytes",
      ),
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
// pl-10 leaves room for the leading icon every field carries.
const inputClassName =
  "h-12 rounded-xl border-input bg-muted/50 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary";

const fieldIconClassName = "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none";

/**
 * SignUpForm Component
 *
 * Handles user registration (all 10 required fields) with validation and
 * error feedback. Rendered as the swappable left-panel content inside
 * AuthSlide, which owns the shared two-column shell/branding panel —
 * `onSignInClick` swaps to the sign-in view in place rather than
 * navigating to a separate route.
 */
export default function SignUpForm({ onSignInClick }: { onSignInClick: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enrollmentCourseId = searchParams.get("enrollCourse");
  const [registerUser, { isLoading }] = useRegisterMutation();

  // 2. Initialize Form
  const {
    register,
    handleSubmit,
    control,
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
      const payload: RegisterRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        district: values.district,
        dateOfBirth: values.dateOfBirth,
        alStream: values.alStream,
      };

      await registerUser(payload).unwrap();
      toast.success("Account created! Check your email for a verification code.");
      // Registering does not log the user in — they must verify their
      // email via OTP first, so we redirect explicitly rather than
      // relying on GuestGuard's isAuthenticated-driven redirect.
      const intent = enrollmentCourseId
        ? `&enrollCourse=${encodeURIComponent(enrollmentCourseId)}`
        : "";
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}${intent}`);
    } catch (error: unknown) {
      // Check if it's a normalized field error from our baseApi
      if (isNormalizedApiError(error) && error.field) {
        setError(error.field as keyof RegisterFormValues, {
          type: "server",
          message: error.message,
        });
      } else {
        toast.error(
          isNormalizedApiError(error)
            ? error.message
            : "Registration failed. Please try again.",
        );
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <h2 className="font-sans text-3xl font-bold text-[#0E1116]">
          New to{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
            Foundry?
          </span>
        </h2>
        <p className="font-alt text-[#5B6472]">Start your journey with Foundry Academy</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* First Name */}
          <div className="space-y-2.5">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className={fieldIconClassName} />
              <Input
                id="firstName"
                type="text"
                placeholder="Jane"
                className={inputClassName}
                error={!!errors.firstName}
                disabled={isLoading}
                {...register("firstName")}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2.5">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className={fieldIconClassName} />
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                className={inputClassName}
                error={!!errors.lastName}
                disabled={isLoading}
                {...register("lastName")}
              />
            </div>
            {errors.lastName && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.lastName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2.5">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className={fieldIconClassName} />
              <Input
                id="phone"
                type="tel"
                placeholder="0771234567"
                className={inputClassName}
                error={!!errors.phone}
                disabled={isLoading}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2.5">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="dateOfBirth"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.dateOfBirth}
                  disabled={isLoading}
                />
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* District */}
          <div className="space-y-2.5">
            <Label htmlFor="district">District</Label>
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <Select
                  id="district"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={DISTRICTS}
                  placeholder="Select district"
                  icon={MapPin}
                  error={!!errors.district}
                  disabled={isLoading}
                />
              )}
            />
            {errors.district && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.district.message}</p>
            )}
          </div>

          {/* AL Stream */}
          <div className="space-y-2.5">
            <Label htmlFor="alStream">A/L Stream</Label>
            <Controller
              name="alStream"
              control={control}
              render={({ field }) => (
                <Select
                  id="alStream"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={AL_STREAMS}
                  placeholder="Select A/L stream"
                  icon={GraduationCap}
                  error={!!errors.alStream}
                  disabled={isLoading}
                />
              )}
            />
            {errors.alStream && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.alStream.message}</p>
            )}
          </div>

          {/* Address (full width) */}
          <div className="space-y-2.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <Home className={fieldIconClassName} />
              <Input
                id="address"
                type="text"
                placeholder="123 Main Street, Colombo"
                className={inputClassName}
                error={!!errors.address}
                disabled={isLoading}
                {...register("address")}
              />
            </div>
            {errors.address && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.address.message}</p>
            )}
          </div>

          {/* Email (full width) */}
          <div className="space-y-2.5 sm:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className={fieldIconClassName} />
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
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className={fieldIconClassName} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={inputClassName}
                error={!!errors.password}
                disabled={isLoading}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className={fieldIconClassName} />
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
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
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
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignInClick}
            className="font-semibold text-primary hover:text-primary/80"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
