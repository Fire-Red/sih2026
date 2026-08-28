import React from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";


export default function LoginPage() {
  return (
    <div className="bg-card border border-border-soft rounded-3xl p-6 sm:p-8 shadow-xs">
      <AuthHeader
        title="Sign in to CivicPulse"
        subtitle="Access validated civic intelligence, capability assembly, and problem registries."
      />
      <LoginForm />
     
    </div>
  );
}
