"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Eye, EyeOff } from "lucide-react";
import "@/app/enterprise-theme.css";

const superAdminRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SuperAdminRegisterSchema = z.infer<typeof superAdminRegisterSchema>;

export default function SuperAdminRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuperAdminRegisterSchema>({
    resolver: zodResolver(superAdminRegisterSchema),
  });

  const onSubmit = async (data: SuperAdminRegisterSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/superadmin-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registration failed");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="enterprise-bg enterprise-animate-fade-in flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="enterprise-card enterprise-animate-slide-up w-full max-w-md p-8">
        {/* Enterprise Brand Header */}
        <div className="enterprise-brand">
          <div className="enterprise-brand-icon">
            <Shield className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="enterprise-title text-2xl font-bold">
              SuperAdmin Portal
            </h1>
            <p className="enterprise-subtitle mt-1 text-sm">
              Singla RO Mart Enterprise
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="mt-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-[var(--enterprise-text-primary)]">
              Create SuperAdmin Account
            </h2>
            <p className="enterprise-subtitle mt-2 text-sm">
              One-time setup for system administrator access
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="enterprise-error">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="enterprise-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="enterprise-input w-full"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-[var(--enterprise-error)]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="enterprise-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="enterprise-input w-full pr-10"
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--enterprise-text-muted)] hover:text-[var(--enterprise-text-primary)]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-[var(--enterprise-error)]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="enterprise-label">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="enterprise-input w-full pr-10"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--enterprise-text-muted)] hover:text-[var(--enterprise-text-primary)]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-[var(--enterprise-error)]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="enterprise-btn w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating SuperAdmin...
                </span>
              ) : (
                "Create SuperAdmin Account"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-[var(--enterprise-text-muted)]">
              Already have an account?{" "}
            </span>
            <a href="/login" className="enterprise-link">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}