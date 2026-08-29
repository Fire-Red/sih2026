"use client";

import { startTransition, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getSession } from "@/lib/auth/session";
import type { UserSession } from "@/types/auth";

interface WorkspaceFrameProps { children: ReactNode; }

export function WorkspaceFrame({ children }: WorkspaceFrameProps) {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.replace("/login");
      return;
    }
    startTransition(() => {
      setSession(currentSession);
      setChecked(true);
    });
  }, [router]);

  if (!checked || !session) return null;
  return <div className="min-h-screen bg-background"><DashboardSidebar session={session} /><main className="min-h-screen px-4 py-8 sm:px-8 lg:py-12 lg:pl-72 lg:pr-12">{children}</main></div>;
}
