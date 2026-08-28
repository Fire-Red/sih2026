"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerWithEmail } from "@/lib/firebase/auth-service";
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await registerWithEmail(fullName, email, password);
      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed.";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-xs rounded-xl bg-[#fff1f1] border border-[#cf202f]/20 text-[#cf202f]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Full name
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="h-11 rounded-xl bg-background border-border-soft focus-visible:ring-primary pl-9 text-sm"
            />
            <User className="h-4 w-4 text-muted-foreground absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Email address
          </label>
          <div className="relative">
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-11 rounded-xl bg-background border-border-soft focus-visible:ring-primary pl-9 text-sm"
            />
            <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Create password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-11 rounded-xl bg-background border-border-soft focus-visible:ring-primary pl-9 pr-10 text-sm"
            />
            <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-full bg-primary hover:bg-[#003ecc] text-white font-medium text-sm transition-colors cursor-pointer mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </span>
          ) : (
            "Continue"
          )}
        </Button>

        <div className="text-center pt-2">
          <span className="text-xs text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link
            href="/login"
            className="text-xs font-medium text-primary hover:text-[#003ecc] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
