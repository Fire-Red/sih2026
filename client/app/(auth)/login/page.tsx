import React from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to continue to your workspace."
      />
      <LoginForm />
    </div>
  );
}
