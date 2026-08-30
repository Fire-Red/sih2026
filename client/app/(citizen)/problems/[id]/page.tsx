"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Loader2, MapPin, ExternalLink } from "lucide-react";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";
import { Button } from "@/components/ui/button";
import { REPORT_CATEGORIES } from "@/lib/constants/report-categories";

interface Problem { id: string; title: string; description: string; category: string; subcategory: string | null; severity: string; district: string | null; blockOrPanchayat: string | null; pinCode: string | null; formattedAddress: string | null; latitude: string | null; longitude: string | null; status: string; endorsementCount: number; appliedTeamsCount: number; maxTeamsAllowed: number; sponsoringDepartment: string | null; createdAt: string; updatedAt: string; }
interface Evidence { id: string; mediaType: string; mediaUrl: string; caption: string | null; }
interface DetailResponse { success?: boolean; problem?: Problem; evidence?: Evidence[]; error?: string; }

const statuses = ["submitted", "under_review", "fused_clustered", "validated", "assigned_to_hei", "solution_in_progress", "resolved_deployed"];
const statusLabels: Record<string, string> = { submitted: "Submitted", under_review: "Under review", fused_clustered: "Related reports found", validated: "Validated", assigned_to_hei: "Team assigned", solution_in_progress: "Solution in progress", resolved_deployed: "Outcome recorded", rejected: "Closed" };
const categoryName = (value: string) => REPORT_CATEGORIES.find((item) => item.id === value)?.name ?? value.replaceAll("_", " ");

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DetailResponse>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch(`/api/problems/${id}`).then(async (response) => {
      const result = (await response.json()) as DetailResponse;
      setData(result);
    }).catch(() => setData({ error: "Unable to load this problem." })).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <WorkspaceFrame><div className="flex items-center gap-3 py-20 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading problem details</div></WorkspaceFrame>;
  if (!data.success || !data.problem) return <WorkspaceFrame><div className="py-16"><p className="text-sm text-destructive">{data.error ?? "Problem not found."}</p><Link href="/problems" className="mt-5 inline-flex"><Button variant="outline">Back to problems</Button></Link></div></WorkspaceFrame>;

  const { problem, evidence = [] } = data;
  const currentStatus = statuses.indexOf(problem.status);
  const place = [problem.formattedAddress, problem.blockOrPanchayat, problem.district, problem.pinCode].filter(Boolean).join(", ");
  const isImage = (item: Evidence) => item.mediaType.startsWith("image/") || item.mediaType === "image";

  return <WorkspaceFrame><main className="mx-auto max-w-5xl pb-16"><Link href="/problems" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All problems</Link><header className="mt-8 border-b border-border pb-8"><div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><span>{categoryName(problem.category)}</span><span aria-hidden="true">/</span><span className="text-primary">{statusLabels[problem.status] ?? problem.status}</span></div><h1 className="mt-4 max-w-4xl text-3xl font-medium leading-tight tracking-[-0.05em] text-foreground sm:text-5xl">{problem.title}</h1><p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">{problem.description}</p><p className="mt-5 text-xs text-muted-foreground">Updated {new Date(problem.updatedAt).toLocaleDateString()} · First reported {new Date(problem.createdAt).toLocaleDateString()}</p></header>
    <section className="grid gap-8 py-8 lg:grid-cols-[1.3fr_0.7fr]"><div className="space-y-8"><section><h2 className="text-lg font-medium tracking-[-0.025em]">What is confirmed</h2><dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card"><div className="flex gap-5 p-4"><dt className="w-32 shrink-0 text-xs text-muted-foreground">Category</dt><dd className="text-sm text-foreground">{categoryName(problem.category)}{problem.subcategory ? `, ${problem.subcategory}` : ""}</dd></div><div className="flex gap-5 p-4"><dt className="w-32 shrink-0 text-xs text-muted-foreground">Urgency</dt><dd className="text-sm capitalize text-foreground">{problem.severity}</dd></div><div className="flex gap-5 p-4"><dt className="w-32 shrink-0 text-xs text-muted-foreground">Supporting reports</dt><dd className="text-sm text-foreground">{problem.endorsementCount}</dd></div></dl></section><section><h2 className="text-lg font-medium tracking-[-0.025em]">Place</h2><div className="mt-4 rounded-xl border border-border bg-card p-5">{place ? <p className="flex items-start gap-3 text-sm leading-6 text-foreground"><MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />{place}</p> : <p className="text-sm text-muted-foreground">Location not provided.</p>}{problem.latitude && problem.longitude && <p className="mt-4 font-mono text-[10px] text-muted-foreground">Coordinates recorded, {problem.latitude}, {problem.longitude}</p>}</div></section><section><h2 className="text-lg font-medium tracking-[-0.025em]">Evidence</h2>{evidence.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No evidence has been attached.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{evidence.map((item) => <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">{isImage(item) && <img src={item.mediaUrl} alt={item.caption ?? "Attached evidence"} className="aspect-video w-full object-cover" />}<div className="flex items-center gap-3 p-4">{!isImage(item) && <FileText className="h-5 w-5 shrink-0 text-primary" />}<div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{item.caption ?? "Attached evidence"}</p><p className="mt-1 text-xs text-muted-foreground">{isImage(item) ? "Image" : "Document"}</p></div><a href={item.mediaUrl} target="_blank" rel="noreferrer" aria-label={`Open ${item.caption ?? "evidence"}`} className="text-primary hover:text-primary/70"><ExternalLink className="h-4 w-4" /></a></div></div>)}</div>}</section></div><aside className="space-y-5"><section className="rounded-xl border border-border bg-card p-5"><h2 className="text-sm font-medium text-foreground">Progress</h2><ol className="mt-5 space-y-4">{statuses.map((status, index) => <li key={status} className="flex gap-3"><span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${index <= currentStatus ? "bg-primary" : "bg-border"}`} /><span className={`text-xs ${index <= currentStatus ? "text-foreground" : "text-muted-foreground"}`}>{statusLabels[status]}</span></li>)}</ol></section><section className="rounded-xl border border-border bg-muted/40 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Team places</p><p className="mt-3 text-2xl font-medium text-foreground">{problem.appliedTeamsCount} of {problem.maxTeamsAllowed}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Only real proposal availability is shown here.</p></section></aside></section>
  </main></WorkspaceFrame>;
}
