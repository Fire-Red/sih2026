"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getSession } from "@/lib/auth/session";
import type { UserSession } from "@/types/auth";

interface WorkspaceFrameProps {
  children: ReactNode;
}

export function WorkspaceFrame({ children }: WorkspaceFrameProps) {
  const router = useRouter();
  const [session] = useState<UserSession | null>(() => getSession());

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [router, session]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar session={session} />
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:py-12 lg:pl-72 lg:pr-12">
        {children}
      </main>
    </div>
  );
}
