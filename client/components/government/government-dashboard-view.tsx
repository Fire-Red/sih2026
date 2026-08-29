"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, FileSearch, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReviewQueue } from "@/lib/api/government-review-api";
import type { ReviewQueueItem } from "@/types/government-review";

export function GovernmentDashboardView() {
  const [reviews, setReviews] = useState<ReviewQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReviews(await getReviewQueue());
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load review data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadReviews(), 0);
    return () => window.clearTimeout(timer);
  }, [loadReviews]);

  const totalPending = reviews.reduce((acc, curr) => acc + curr.pendingApplicationCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Government Oversight Console</span>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Department Decision Workspace
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review candidate systemic problems, compare student pitches side-by-side, and track pilot milestones.
          </p>
        </div>
        <Link href="/government/manage" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><FileSearch className="mr-2 h-4 w-4" aria-hidden="true" />{loading || error ? "Review proposals" : `Review proposals (${totalPending})`}</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Proposals in Queue</span>
            <FileSearch className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-mono text-2xl font-medium text-foreground">
            {loading ? "Loading" : error ? "Unavailable" : totalPending}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Pitches requiring side-by-side comparison</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Problems awaiting review</span>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-mono text-2xl font-medium text-foreground">
            {loading ? "Loading" : error ? "Unavailable" : reviews.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Validated problems with submitted applications</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Review guidance</span>
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">Human decision required</p>
          <p className="mt-1 text-xs text-muted-foreground">Use the review console to compare evidence before selecting a team.</p>
        </div>
      </div>

      {error && <div role="alert" className="flex items-center gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="flex-1">{error}</span><Button type="button" variant="outline" size="sm" onClick={() => void loadReviews()}><RefreshCw className="mr-2 h-3.5 w-3.5" aria-hidden="true" />Retry</Button></div>}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Active Review Backlog</h2>
          <Link href="/government/manage" className="inline-flex min-h-11 items-center gap-1 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Open review console <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
            Loading review queue...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-8 text-center text-sm text-destructive">
            Review data is unavailable. Use Retry above to try again.
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-semantic-up/60" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-medium text-foreground">No proposals awaiting review</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              New applications will appear here after they are submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(({ problem, pendingApplicationCount, applicationCount }) => (
              <div key={problem.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase text-primary">
                      {problem.category.replace("_", " ")}
                    </span>
                    {problem.district && (
                      <span className="text-xs text-muted-foreground">
                        {problem.district}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-foreground">
                    {problem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium text-foreground">
                      {pendingApplicationCount} pending
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {applicationCount} total submitted
                    </p>
                  </div>
                  <Link href="/government/manage" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Review <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" /></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
