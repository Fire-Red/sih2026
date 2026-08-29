"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginWithEmail, requestPasswordReset } from "@/lib/firebase/auth-service";
import { useUserStore } from "@/store/use-user-store";
import { setSession } from "@/lib/auth/session";
import { getSession } from "@/lib/auth/session";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/dashboard");
  }, [router]);

  useEffect(() => {
    if (getSession()) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const userSession = await loginWithEmail(email, password);
      // Check if user is already onboarded
      try {
        const res = await fetch(`/api/users/profile?firebaseUid=${userSession.id}&email=${encodeURIComponent(userSession.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data?.isOnboarded) {
            setSession({
              ...userSession,
              name: data.data.displayName || userSession.name,
              role: data.data.role,
            });
            const { setUser } = useUserStore.getState();
            setUser(data.data);
            router.push("/dashboard");
            return;
          }
        }
      } catch {
        // Fall back to onboarding if check fails
      }
      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to authenticate.";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    try {
      await requestPasswordReset(email);
      setResetSent(true);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message.replace("Firebase: ", "") : "Unable to send reset email.");
    }
  };

  return (
    <div className="space-y-5">
      {resetSent && (
        <div className="rounded-xl border border-semantic-up/25 bg-semantic-up/5 p-3 text-xs text-semantic-up">
          Check your email for a password reset link.
        </div>
      )}
      {error && (
        <div className="p-3 text-xs rounded-xl bg-destructive/8 border border-destructive/20 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Email address
          </label>
          <div>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-12 rounded-lg bg-background px-3 text-sm focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">
              Password
            </label>
            <button
              type="button"
              onClick={() => void handlePasswordReset()}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-12 rounded-lg bg-background px-3 pr-10 text-sm focus-visible:ring-primary"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-3 h-12 w-full rounded-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="text-center pt-2">
          <span className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/register"
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
