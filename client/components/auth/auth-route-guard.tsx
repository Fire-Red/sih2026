"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuth] = useState(() => (typeof window !== "undefined" ? Boolean(getSession()?.id) : false));

  useEffect(() => {
    if (isAuth) {
      router.replace("/dashboard");
    }
  }, [isAuth, router]);

  if (isAuth) {
    return null;
  }

  return <>{children}</>;
}
