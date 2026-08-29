"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, Layers3, MapPin } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { useUserStore } from "@/store/use-user-store";
import { UserRole, UserSession } from "@/types/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { CitizenDashboard } from "@/components/dashboard/citizen-dashboard";

interface RoleContent {
  label: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
}

const roleContent: Record<UserRole, RoleContent> = {
  citizen: { label: "Citizen workspace", title: "Start with what you know.", description: "Share a local problem with enough context for others to act on it.", primaryLabel: "Report a problem", primaryHref: "/report" },
  student: { label: "Student workspace", title: "Find a problem worth solving.", description: "Explore open problems and discover where your skills can contribute.", primaryLabel: "Explore problems", primaryHref: "/problems" },
  government: { label: "Government workspace", title: "Review what needs attention.", description: "Move from incoming reports to clear, reviewable problem records.", primaryLabel: "Review problems", primaryHref: "/problems" },
  institution: { label: "Institution workspace", title: "Make your capabilities visible.", description: "Keep your profile ready for problems that need your expertise.", primaryLabel: "Explore problems", primaryHref: "/problems" },
  industry: { label: "Partner workspace", title: "Find a useful place to contribute.", description: "Explore problem areas where technology, funding, or deployment support is needed.", primaryLabel: "Explore problems", primaryHref: "/problems" },
  admin: { label: "Admin workspace", title: "Keep the platform trustworthy.", description: "Review the working system and maintain reliable records for every user.", primaryLabel: "View problem records", primaryHref: "/problems" },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

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

  if (session.role === "citizen") {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar session={session} />
        <main className="min-h-screen px-4 py-8 sm:px-8 lg:pl-72 lg:pr-12 lg:py-12">
          <CitizenDashboard session={session} profile={userProfile} />
        </main>
      </div>
    );
  }

  const content = roleContent[session.role];
  const firstName = session.name.split(" ")[0] || "there";
  const location = userProfile?.geoContext?.district;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar session={session} />
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:pl-72 lg:pr-12 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{content.label}</p>
              <h1 className="text-3xl font-medium tracking-[-0.05em] text-foreground sm:text-4xl">{getGreeting()}, {firstName}</h1>
              {location && <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{location}</p>}
            </div>
            <Link href={content.primaryHref}><Button className="h-11 gap-2 rounded-lg px-5">{content.primaryLabel}<ArrowRight className="h-4 w-4" /></Button></Link>
          </header>

          <section className="grid gap-4 py-8 md:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="mb-12 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Layers3 className="h-5 w-5" /></div>
              <p className="max-w-xl text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-3xl">{content.title}</p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{content.description}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Next step</p>
              <h2 className="mt-4 text-lg font-medium tracking-[-0.02em] text-foreground">Your workspace is ready.</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose one action to begin. You can return here whenever you need a clear starting point.</p>
              <Link href={content.primaryHref} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">{content.primaryLabel}<ArrowRight className="h-4 w-4" /></Link>
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Available now</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/problems" className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground"><Layers3 className="h-4 w-4" /></span>
                <span className="flex-1 text-sm font-medium text-foreground">Browse problem records</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
              <Link href="/report" className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground"><FileText className="h-4 w-4" /></span>
                <span className="flex-1 text-sm font-medium text-foreground">Share a problem</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
