"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  FilePlus2,
  LocateFixed,
  MessageSquareText,
  Network,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile, UserSession } from "@/types/auth";

interface CitizenDashboardProps {
  session: UserSession;
  profile: UserProfile | null;
}

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  district: string;
  endorsementCount: number;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  fused_clustered: "Related reports found",
  validated: "Validated",
  assigned_to_hei: "Team assigned",
  solution_in_progress: "Solution in progress",
  resolved_deployed: "Outcome recorded",
};

const journey = [
  { title: "You share what you know", description: "Add the context that feels useful, with evidence when you have it.", icon: FilePlus2 },
  { title: "Reports are connected", description: "Related reports are compared by meaning, place, and time.", icon: Network },
  { title: "People review the signal", description: "A human reviewer checks the problem before it moves forward.", icon: ShieldCheck },
  { title: "Progress stays visible", description: "You can follow updates as work moves from review to action.", icon: Activity },
];

export function CitizenDashboard({ session, profile }: CitizenDashboardProps) {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const firstName = session.name.split(" ")[0] || "there";
  const location = profile?.geoContext?.district;

  useEffect(() => {
    let active = true;
    const loadReports = async () => {
      try {
        const response = await fetch(`/api/reports?reporterId=${encodeURIComponent(session.id)}`);
        const data = (await response.json()) as { success?: boolean; reports?: ReportItem[] };
        if (active && data.success && data.reports) {
          startTransition(() => setReports(data.reports ?? []));
        }
      } catch {
        if (active) startTransition(() => setReports([]));
      } finally {
        if (active) startTransition(() => setLoading(false));
      }
    };
    void loadReports();
    return () => {
      active = false;
    };
  }, [session.id]);

  const visibleReports = useMemo(() => reports.slice(0, 3), [reports]);
  const activeReports = reports.filter((report) => report.status !== "resolved_deployed").length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Citizen workspace</p>
          <h1 className="text-3xl font-medium tracking-[-0.05em] text-foreground sm:text-4xl">Good to see you, {firstName}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Turn what you notice into a clear record that people can review and act on.</p>
          {location && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><LocateFixed className="h-3.5 w-3.5 text-primary" />{location}</p>}
        </div>
        <Link href="/report"><Button className="h-11 gap-2 rounded-xl px-5"><FilePlus2 className="h-4 w-4" /> Report a problem</Button></Link>
      </header>

      <section className="grid gap-4 py-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><MessageSquareText className="h-5 w-5" /></div><span className="rounded-full bg-muted px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Start here</span></div>
          <h2 className="mt-12 max-w-xl text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-3xl">Have you noticed something that needs attention?</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">A useful report can be simple. Describe what is happening, where it matters, and what you have seen.</p>
          <Link href="/report" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-75">Open the report form <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="rounded-2xl border border-border bg-muted/40 p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Your activity</p>
          <p className="mt-5 text-4xl font-medium tracking-[-0.05em] text-foreground">{loading ? "..." : activeReports}</p>
          <p className="mt-1 text-sm text-muted-foreground">reports currently moving through review</p>
          <Link href="/track" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-75">View activity <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-t border-border py-8">
        <div className="flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Recent signals</p><h2 className="mt-2 text-xl font-medium tracking-[-0.03em] text-foreground">Follow what has been reported</h2></div><Link href="/track" className="hidden items-center gap-1 text-xs font-medium text-primary sm:flex">Open tracker <ArrowRight className="h-3.5 w-3.5" /></Link></div>
        {loading ? <div className="mt-5 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading recent reports...</div> : visibleReports.length === 0 ? <div className="mt-5 rounded-xl border border-dashed border-border bg-card p-8 text-center"><UsersRound className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-3 text-sm font-medium text-foreground">No public reports are available yet.</p><p className="mt-1 text-xs text-muted-foreground">Your report can be the first clear signal.</p><Link href="/report" className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary">Create a report <ArrowRight className="h-3.5 w-3.5" /></Link></div> : <div className="mt-5 grid gap-3">{visibleReports.map((report) => <Link key={report.id} href={`/track?submitted=${report.id}`} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Activity className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-foreground">{report.title}</span><span className="mt-1 block text-xs text-muted-foreground">{statusLabels[report.status] ?? "In review"} · {report.district}</span></span><span className="hidden text-xs text-muted-foreground sm:block">{report.endorsementCount} support</span><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" /></Link>)}</div>}
      </section>

      <section className="border-t border-border py-8"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">What happens next</p><h2 className="mt-2 text-xl font-medium tracking-[-0.03em] text-foreground">A report becomes more useful over time</h2></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{journey.map(({ title, description, icon: Icon }, index) => <div key={title} className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span><Icon className="h-4 w-4 text-primary" /></div><h3 className="mt-10 text-sm font-medium text-foreground">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p></div>)}</div></section>
    </div>
  );
}
