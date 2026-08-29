"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, MapPin, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReviewDetail, getReviewQueue, selectReviewWinner } from "@/lib/api/government-review-api";
import { getSession } from "@/lib/auth/session";
import type { ReviewApplication, ReviewDetail, ReviewQueueItem } from "@/types/government-review";
import { ReviewProposalCard } from "./review-proposal-card";

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "error" in error && typeof error.error === "string") return error.error;
  return "Something went wrong while loading this review.";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function GovernmentReviewConsole() {
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [detail, setDetail] = useState<ReviewDetail | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ReviewApplication | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successProjectId, setSuccessProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const loadDetail = useCallback(async (problemId: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      setDetail(await getReviewDetail(problemId));
    } catch (requestError: unknown) {
      setError(errorMessage(requestError));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = getSession();
      if (!session || session.role !== "government") {
        setAccessDenied(true);
        return;
      }
      const reviews = await getReviewQueue();
      setQueue(reviews);
      if (reviews[0]) await loadDetail(reviews[0].problem.id);
    } catch (requestError: unknown) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [loadDetail]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadQueue(), 0);
    return () => window.clearTimeout(timer);
  }, [loadQueue]);

  const openSelection = (application: ReviewApplication) => {
    setSelectedApplication(application);
    setNotes("");
    triggerRef.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
    dialogRef.current?.showModal();
  };

  const closeSelection = () => {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  };

  const confirmSelection = async () => {
    if (!detail || !selectedApplication) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await selectReviewWinner(detail.problem.id, selectedApplication.id, notes.trim());
      setSuccessProjectId(result.projectId);
      closeSelection();
      await loadDetail(detail.problem.id);
      setQueue((items) => items.filter((item) => item.problem.id !== detail.problem.id));
    } catch (requestError: unknown) {
      setError(errorMessage(requestError));
      if (typeof requestError === "object" && requestError !== null && "status" in requestError && requestError.status === 409) await loadDetail(detail.problem.id);
    } finally {
      setSubmitting(false);
    }
  };

  if (accessDenied) {
    return <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12"><Card className="w-full"><CardContent className="space-y-4 p-8 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" /><h1 className="text-2xl font-medium tracking-[-0.03em]">Government access required</h1><p className="text-base leading-7 text-muted-foreground">Sign in with an authorized government account to review proposals.</p><Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Go to sign in</Link></CardContent></Card></main>;
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-[96rem] space-y-8 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
      <header className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Decision workspace</p><h1 className="text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">Review proposals</h1><p className="text-base leading-7 text-muted-foreground">Compare the submitted approaches, review their evidence, and move one validated problem into delivery.</p></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="h-2 w-2 rounded-full bg-semantic-up" aria-hidden="true" />{queue.length} waiting for review</div>
      </header>

      {error && <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><div className="flex-1">{error}</div><Button type="button" variant="outline" size="sm" onClick={() => void loadQueue()}><RefreshCw className="mr-2 h-3.5 w-3.5" aria-hidden="true" />Retry</Button></div>}

      {loading ? <div role="status" className="rounded-lg border border-border bg-card p-8 text-base text-muted-foreground">Loading proposals…</div> : queue.length === 0 && !detail ? <Card><CardContent className="space-y-3 p-12 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-semantic-up" aria-hidden="true" /><h2 className="text-xl font-medium">The review queue is clear</h2><p className="text-base text-muted-foreground">New submissions will appear here when they are ready for review.</p></CardContent></Card> : <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside aria-label="Problems awaiting review" className="space-y-3"><div className="flex items-center justify-between"><h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Problems</h2><span className="font-mono text-xs text-muted-foreground">{queue.length}</span></div><ul className="space-y-2">{queue.map((item) => <li key={item.problem.id}><button type="button" className={`w-full rounded-lg border p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${detail?.problem.id === item.problem.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted"}`} onClick={() => void loadDetail(item.problem.id)}><span className="block truncate text-sm font-medium text-foreground">{item.problem.title}</span><span className="mt-2 block text-xs capitalize text-muted-foreground">{item.problem.category.replaceAll("_", " ")}</span><span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{item.pendingApplicationCount} pending</span></button></li>)}</ul></aside>
        <section aria-live="polite" className="min-w-0 space-y-6">{detailLoading || !detail ? <div role="status" className="rounded-lg border border-border bg-card p-8 text-base text-muted-foreground">Loading review details…</div> : <><Card><CardHeader className="gap-4 border-b border-border p-6"><div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><span>{detail.problem.category.replaceAll("_", " ")}</span><span aria-hidden="true">/</span><span>{detail.problem.severity}</span></div><CardTitle className="max-w-3xl text-2xl font-medium leading-tight tracking-[-0.03em]">{detail.problem.title}</CardTitle><p className="max-w-3xl text-base leading-7 text-muted-foreground">{detail.problem.description}</p><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">{detail.problem.district && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" />{detail.problem.district}{detail.problem.blockOrPanchayat ? `, ${detail.problem.blockOrPanchayat}` : ""}</span>}<span>{detail.problem.appliedTeamsCount} of {detail.problem.maxTeamsAllowed} team slots used</span><span>Updated {formatDate(detail.problem.updatedAt)}</span></div>{detail.evidence.length > 0 && <div className="flex flex-wrap gap-3 border-t border-border pt-4">{detail.evidence.map((item) => <a key={item.id} href={item.mediaUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><FileText className="h-4 w-4" aria-hidden="true" />{item.caption || "View evidence"}</a>)}</div>}</CardHeader></Card><div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-medium tracking-[-0.03em]">Submitted approaches</h2><p className="mt-1 text-base text-muted-foreground">Review all proposals before making a selection.</p></div><span className="font-mono text-xs text-muted-foreground">{detail.applications.length} submissions</span></div>{detail.applications.length === 0 ? <Card><CardContent className="p-8 text-base text-muted-foreground">No applications are attached to this problem.</CardContent></Card> : <div className="grid gap-5 xl:grid-cols-2">{detail.applications.map((application) => <ReviewProposalCard key={application.id} application={application} selected={application.status === "selected_winner"} disabled={submitting || Boolean(detail.problem.selectedTeamId)} onSelect={openSelection} />)}</div>}</>}
        </section>
      </div>}

      {successProjectId && <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg border border-semantic-up/25 bg-semantic-up/5 p-4 text-sm text-semantic-up"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Selection recorded.<Link className="inline-flex items-center gap-1 font-medium underline underline-offset-4" href={`/projects/${successProjectId}`}>Open project workspace<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></div>}

      <dialog ref={dialogRef} aria-labelledby="selection-dialog-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-foreground/20"><div className="space-y-5 p-6"><div className="space-y-2"><h2 id="selection-dialog-title" className="text-xl font-medium tracking-[-0.03em]">Select {selectedApplication?.teamName}</h2><p className="text-sm leading-6 text-muted-foreground">This will close the other submissions for {detail?.problem.title || "this problem"} and create a project workspace.</p></div><div className="space-y-2"><label htmlFor="review-notes" className="text-sm font-medium">Review notes <span className="font-normal text-muted-foreground">(optional)</span></label><textarea id="review-notes" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} rows={5} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base leading-6 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Record the decision context for the review history." /></div><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={closeSelection} disabled={submitting}>Cancel</Button><Button type="button" onClick={() => void confirmSelection()} disabled={submitting}>{submitting ? "Saving selection…" : "Confirm selection"}</Button></div></div></dialog>
    </main>
  );
}
