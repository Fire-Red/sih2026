"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Building2, Calendar, CheckCircle2, Circle, MapPin, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectDetail } from "@/lib/api/project-api";
import type { ProjectDetail, ProjectMilestone } from "@/types/project-detail";

interface ProjectWorkspaceProps {
  projectId: string;
}

function formatDate(value: string | null): string {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function statusLabel(status: ProjectDetail["project"]["status"]): string {
  return status.replace("_", " ");
}

function MilestoneRow({ milestone }: { milestone: ProjectMilestone }) {
  const completed = milestone.status === "completed";
  const active = milestone.status === "in_progress";
  return (
    <li className={`flex gap-4 rounded-lg border bg-card p-4 ${active ? "border-primary/40" : milestone.status === "overdue" ? "border-destructive/40" : "border-border"}`}>
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {completed ? <CheckCircle2 className="h-4 w-4 text-semantic-up" /> : <Circle className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <p className={`text-sm font-medium ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}>{milestone.title}</p>
          <time dateTime={milestone.dueDate || undefined} className="shrink-0 text-xs text-muted-foreground">{formatDate(milestone.dueDate)}</time>
        </div>
        {milestone.notes && <p className="text-sm leading-6 text-muted-foreground">{milestone.notes}</p>}
      </div>
    </li>
  );
}

function WorkspaceHeader({ detail }: { detail: ProjectDetail }) {
  return (
    <header className="space-y-5 border-b border-border pb-7">
      <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to overview</Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Active project</p><h1 className="max-w-3xl text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">{detail.project.title}</h1><p className="max-w-3xl text-base leading-7 text-muted-foreground">{detail.project.description || "No project description has been recorded."}</p></div>
        <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium capitalize text-primary">{statusLabel(detail.project.status)}</span>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4" aria-hidden="true" />{detail.team.teamName}, {detail.team.institutionName}</span><span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" aria-hidden="true" />Started {formatDate(detail.project.startDate)}</span>{detail.problem.district && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" />{detail.problem.district}</span>}</div>
    </header>
  );
}

export function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setDetail(await getProjectDetail(projectId)); } catch (requestError: unknown) { setError(requestError instanceof Error ? requestError.message : "Unable to load this project."); } finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProject(), 0);
    return () => window.clearTimeout(timer);
  }, [loadProject]);

  if (loading) return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:px-12"><div role="status" className="rounded-lg border border-border bg-card p-8 text-base text-muted-foreground">Loading project workspace…</div></main>;
  if (error || !detail) return <main className="mx-auto max-w-2xl px-4 py-12 sm:px-8"><Card><CardContent className="space-y-4 p-8"><AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" /><h1 className="text-2xl font-medium tracking-[-0.03em]">Project unavailable</h1><p className="text-base leading-7 text-muted-foreground">{error || "This project could not be found."}</p><Button type="button" variant="outline" onClick={() => void loadProject()}><RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />Try again</Button></CardContent></Card></main>;

  const milestones = detail.project.milestones || [];
  const completedCount = milestones.filter((milestone) => milestone.status === "completed").length;
  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
      <WorkspaceHeader detail={detail} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="milestones-title" className="min-w-0 space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 id="milestones-title" className="text-xl font-medium tracking-[-0.03em]">Milestones</h2><p className="mt-1 text-base text-muted-foreground">The delivery plan recorded when this project was created.</p></div><span className="font-mono text-xs text-muted-foreground">{completedCount} of {milestones.length} complete</span></div>{milestones.length === 0 ? <Card><CardContent className="p-8 text-base text-muted-foreground">No milestones have been recorded yet.</CardContent></Card> : <ol className="space-y-3">{milestones.map((milestone) => <MilestoneRow key={milestone.id} milestone={milestone} />)}</ol>}</section>
        <aside className="space-y-4"><Card><CardHeader className="p-5"><CardTitle className="text-sm font-medium">Source problem</CardTitle></CardHeader><CardContent className="space-y-3 p-5 pt-0"><p className="text-sm font-medium text-foreground">{detail.problem.title}</p><p className="text-sm text-muted-foreground">{detail.problem.category.replaceAll("_", " ")}{detail.problem.district ? `, ${detail.problem.district}` : ""}</p><Link href={`/problems?problemId=${detail.problem.id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">View problem <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" /></Link></CardContent></Card><Card><CardHeader className="p-5"><CardTitle className="text-sm font-medium">Selected team</CardTitle></CardHeader><CardContent className="space-y-3 p-5 pt-0"><p className="text-sm font-medium text-foreground">{detail.team.teamName}</p><p className="text-sm text-muted-foreground">{detail.team.institutionName}</p>{detail.application?.pitchSummary && <p className="text-sm leading-6 text-muted-foreground">{detail.application.pitchSummary}</p>}{detail.application?.videoUrl && <a href={detail.application.videoUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Play className="h-4 w-4" aria-hidden="true" />Watch pitch</a>}</CardContent></Card><Card><CardHeader className="p-5"><CardTitle className="text-sm font-medium">Pilot evidence</CardTitle></CardHeader><CardContent className="p-5 pt-0"><p className="text-sm leading-6 text-muted-foreground">{detail.project.pilotEvidence?.length ? `${detail.project.pilotEvidence.length} evidence items recorded.` : "No pilot evidence has been recorded yet."}</p></CardContent></Card></aside>
      </div>
    </main>
  );
}
