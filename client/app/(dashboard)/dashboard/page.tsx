"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { useUserStore } from "@/store/use-user-store";
import { UserSession } from "@/types/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { CitizenDashboard } from "@/components/dashboard/citizen-dashboard";
import { StudentDashboardView } from "@/components/student/student-dashboard-view";
import { InstitutionDashboardView } from "@/components/institution/institution-dashboard-view";
import { GovernmentDashboardView } from "@/components/government/government-dashboard-view";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const userProfile = useUserStore((state) => state.user);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push("/login");
      return;
    }
    startTransition(() => {
      setSession(currentSession);
      setLoading(false);
    });
  }, [router]);

  if (loading || !session) {
    return <div className="min-h-screen bg-background" aria-label="Loading workspace" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar session={session} />
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:pl-72 lg:pr-12 lg:py-12">
        <div className="mx-auto max-w-5xl">
          {session.role === "citizen" && (
            <CitizenDashboard session={session} profile={userProfile} />
          )}
          {session.role === "student" && (
            <StudentDashboardView />
          )}
          {session.role === "institution" && (
            <InstitutionDashboardView />
          )}
          {session.role === "government" && (
            <GovernmentDashboardView />
          )}
          {session.role === "admin" && (
            <GovernmentDashboardView />
          )}
        </div>
      </main>
    </div>
  );
}
