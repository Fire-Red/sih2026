import React from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="bg-card border border-border-soft rounded-3xl p-6 sm:p-8 shadow-xs">
      <AuthHeader
        title="Create your account"
        subtitle="Join the national civic intelligence and problem solving network."
      />
      <RegisterForm />
    </div>
  );
}
