"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Filter, Layers3, Loader2, MapPin, Search } from "lucide-react";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REPORT_CATEGORIES } from "@/lib/constants/report-categories";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  district: string | null;
  status: string;
  endorsementCount: number;
  appliedTeamsCount: number;
  maxTeamsAllowed: number;
  updatedAt: string;
}

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  fused_clustered: "Related reports found",
  validated: "Validated",
  assigned_to_hei: "Team assigned",
  solution_in_progress: "Solution in progress",
  resolved_deployed: "Outcome recorded",
  rejected: "Closed",
};

const categoryName = (value: string) => REPORT_CATEGORIES.find((item) => item.id === value)?.name ?? value.replaceAll("_", " ");

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProblems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/problems");
      const data = (await response.json()) as { success?: boolean; problems?: Problem[]; error?: string };
      if (!response.ok || !data.success || !data.problems) throw new Error(data.error ?? "Unable to load problems.");
      setProblems(data.problems);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load problems.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void fetch("/api/problems").then(async (response) => {
      const data = (await response.json()) as { success?: boolean; problems?: Problem[]; error?: string };
      if (!response.ok || !data.success || !data.problems) throw new Error(data.error ?? "Unable to load problems.");
      if (active) setProblems(data.problems);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load problems.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filteredProblems = useMemo(() => problems.filter((problem) => {
    const searchable = `${problem.title} ${problem.description} ${problem.district ?? ""}`.toLowerCase();
    return (!query.trim() || searchable.includes(query.toLowerCase())) && (category === "all" || problem.category === category) && (status === "all" || problem.status === status);
  }), [category, problems, query, status]);

  return <WorkspaceFrame>
    <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-8">
      <header className="border-b border-border pb-8 pt-6 lg:pt-2">
        <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><Layers3 className="h-4 w-4" /> Problem directory</p>
        <h1 className="max-w-3xl text-3xl font-medium tracking-[-0.05em] text-foreground sm:text-5xl">Problems that need a clear next step.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Browse reported problems and follow the information that has been confirmed so far.</p>
      </header>

      <section className="flex flex-col gap-3 border-b border-border py-6 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search problems or places" className="h-11 pl-10" /></div>
        <div className="flex flex-wrap gap-3"><label className="sr-only" htmlFor="problem-category">Category</label><select id="problem-category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="all">All categories</option>{REPORT_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><label className="sr-only" htmlFor="problem-status">Status</label><select id="problem-status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="all">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      </section>

      {loading && <div className="flex items-center gap-3 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading confirmed problems</div>}
      {!loading && error && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6"><p className="text-sm text-destructive">{error}</p><Button type="button" variant="outline" onClick={() => void loadProblems()} className="mt-4">Try again</Button></div>}
      {!loading && !error && filteredProblems.length === 0 && <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center"><Filter className="mx-auto h-5 w-5 text-muted-foreground" /><h2 className="mt-4 text-base font-medium text-foreground">No matching problems</h2><p className="mt-2 text-sm text-muted-foreground">Try a different search or report a problem you have noticed.</p><Link href="/report" className="mt-5 inline-flex"><Button type="button">Report a problem</Button></Link></div>}
      {!loading && !error && filteredProblems.length > 0 && <div className="space-y-3 py-6"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{filteredProblems.length} available records</p>{filteredProblems.map((problem) => <Link key={problem.id} href={`/problems/${problem.id}`} className="group block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><span>{categoryName(problem.category)}</span><span aria-hidden="true">/</span><span className="text-primary">{statusLabels[problem.status] ?? problem.status}</span></div><h2 className="mt-3 max-w-3xl text-lg font-medium leading-snug tracking-[-0.025em] text-foreground">{problem.title}</h2><p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">{problem.description}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">{problem.district && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{problem.district}</span>}<span>{problem.endorsementCount} supporting reports</span><span>Updated {new Date(problem.updatedAt).toLocaleDateString()}</span></div></div><div className="shrink-0 lg:w-36 lg:text-right"><p className="text-xs text-muted-foreground">Team places</p><p className="mt-1 text-sm font-medium text-foreground">{problem.appliedTeamsCount} of {problem.maxTeamsAllowed} filled</p><span className="mt-4 inline-flex text-xs font-medium text-primary">View details</span></div></div></Link>)}</div>}
    </main>
  </WorkspaceFrame>;
}
