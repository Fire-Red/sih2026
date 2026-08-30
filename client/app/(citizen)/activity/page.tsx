"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, ArrowRight, FilePlus2, Loader2, Network, ShieldCheck } from "lucide-react";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

interface Report { id: string; title: string; description: string; category: string; district: string | null; status: string; createdAt: string; updatedAt: string; }
interface ResponseData { success?: boolean; data?: { reports: Report[] }; error?: string; }

const statusLabels: Record<string, string> = { submitted: "Submitted", under_review: "Under review", fused_clustered: "Related reports found", validated: "Validated", assigned_to_hei: "Team assigned", solution_in_progress: "Solution in progress", resolved_deployed: "Outcome recorded", rejected: "Closed" };
const statusOrder = ["submitted", "under_review", "fused_clustered", "validated", "assigned_to_hei", "solution_in_progress", "resolved_deployed"];

function ReportProgress({ status }: { status: string }) {
  const current = statusOrder.indexOf(status);
  return <ol className="mt-5 flex items-center gap-1" aria-label="Report progress">{statusOrder.map((item, index) => <li key={item} className="flex flex-1 items-center gap-1" title={statusLabels[item]}><span className={`h-2 w-full rounded-full ${index <= current ? "bg-primary" : "bg-border"}`} />{index < statusOrder.length - 1 && <span className="sr-only">{statusLabels[item]}</span>}</li>)}</ol>;
}

export default function ActivityPage() {
  const session = getSession();
  const sessionId = session?.id;
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    void fetch(`/api/dashboard/citizen?firebaseUid=${encodeURIComponent(sessionId)}`).then(async (response) => {
      const data = (await response.json()) as ResponseData;
      if (!response.ok || !data.success || !data.data) throw new Error(data.error ?? "Unable to load activity.");
      setReports(data.data.reports);
    }).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Unable to load activity.")).finally(() => setLoading(false));
  }, [sessionId]);

  return <WorkspaceFrame><main className="mx-auto max-w-5xl pb-16"><header className="border-b border-border pb-8"><p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><Activity className="h-4 w-4" /> Your activity</p><h1 className="text-3xl font-medium tracking-[-0.05em] text-foreground sm:text-5xl">Follow what happens next.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">See the current state of every report you have shared. A quiet status means the record is still being reviewed.</p></header>
    {loading && <div className="flex items-center gap-3 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading your activity</div>}
    {!loading && error && <div className="py-12"><p className="text-sm text-destructive">{error}</p><Button type="button" variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try again</Button></div>}
    {!loading && !error && reports.length === 0 && <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center"><FilePlus2 className="mx-auto h-5 w-5 text-muted-foreground" /><h2 className="mt-4 text-base font-medium text-foreground">Your activity will appear here</h2><p className="mt-2 text-sm text-muted-foreground">Share a clear report to start following its progress.</p><Link href="/report" className="mt-5 inline-flex"><Button>Report a problem</Button></Link></div>}
    {!loading && !error && reports.length > 0 && <section className="space-y-3 py-8">{reports.map((report) => <article key={report.id} className="rounded-xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Network className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-medium leading-6 text-foreground">{report.title}</h2><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary">{statusLabels[report.status] ?? report.status}</span></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{report.description}</p><p className="mt-3 text-xs text-muted-foreground">{report.district ?? "Location not provided"} · Updated {new Date(report.updatedAt).toLocaleDateString()}</p><ReportProgress status={report.status} /><div className="mt-5 flex flex-wrap items-center gap-4"><Link href={`/problems/${report.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-75">Open record <ArrowRight className="h-3.5 w-3.5" /></Link>{report.status === "submitted" && <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Waiting for review</span>}</div></div></div></article>)}</section>}
  </main></WorkspaceFrame>;
}
