export type Role = "STUDENT" | "ADMIN" | "SUPER_ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
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

export type ApiSuccess<T> = {
  success: true;
  data?: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
  field?: string;
  details?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;