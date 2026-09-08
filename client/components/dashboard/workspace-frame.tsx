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
      <main className={`min-h-screen ${session.role === "citizen" ? "" : "lg:pl-60"}`}>
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
