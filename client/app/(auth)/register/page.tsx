import React from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div>
      <AuthHeader
        title="Create an account"
        subtitle="Set up a workspace for your role."
      />
      <RegisterForm />
    </div>
  );
}
