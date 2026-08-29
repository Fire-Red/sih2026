import React from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <AuthHeader
        title="Create your account"
        subtitle="Set up a workspace for your role."
      />
      <RegisterForm />
    </div>
  );
}
