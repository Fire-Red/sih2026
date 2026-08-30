import React from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      <AuthHeader
        title="Sign in"
        subtitle="Enter your credentials to access your workspace."
      />
      <LoginForm />
    </div>
  );
}
