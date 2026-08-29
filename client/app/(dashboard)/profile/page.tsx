"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { getSession } from "@/lib/auth/session";
import { UserSession } from "@/types/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.replace("/login");
      return;
    }
    startTransition(() => setSession(currentSession));
  }, [router]);

  if (!session) return <div className="min-h-screen bg-background" aria-label="Loading profile" />;
  return <div className="min-h-screen bg-background"><DashboardSidebar session={session} /><main className="min-h-screen px-4 py-8 sm:px-8 lg:py-12 lg:pl-72 lg:pr-12"><ProfileSettings session={session} /></main></div>;
}
