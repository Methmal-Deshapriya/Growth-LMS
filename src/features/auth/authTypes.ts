import type { Role } from "@/lib/constants";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  phone?: string | null;
  address?: string | null;
  district?: string | null;
  dateOfBirth?: string | null;
  alStream?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  name?: string;
  phone?: string;
  address?: string;
  district?: string;
  dateOfBirth?: string;
  alStream?: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type VerifyOtpRequest = {
  email: string;
  code: string;
};

export type ResendOtpRequest = {
  email: string;
};
