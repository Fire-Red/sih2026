"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  RefreshCw,
  ShieldCheck,
  Layers,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";
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

  const newComplaintsCount = reviews.filter((r) => r.problem.status === "submitted").length;
  const activeChallengesCount = reviews.filter((r) => r.problem.status === "validated" && !r.problem.selectedTeamId).length;
  const totalPendingPitches = reviews.reduce((acc, curr) => acc + curr.pendingApplicationCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-medium">
            Department Command Overview
          </span>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl mt-1">
            Officer Decision Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live telemetry of incoming community complaints, active challenge quotas, and student pitches.
          </p>
        </div>
        <Link
          href="/government/manage"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
        >
          <FileSearch className="mr-2 h-4 w-4" aria-hidden="true" />
          Open Decision Console
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              New Intake
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="font-mono text-3xl font-medium text-foreground">
            {loading ? "..." : error ? "-" : newComplaintsCount}
          </p>
          <p className="text-xs text-muted-foreground">Awaiting officer triage</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Published Challenges
            </span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <p className="font-mono text-3xl font-medium text-foreground">
            {loading ? "..." : error ? "-" : activeChallengesCount}
          </p>
          <p className="text-xs text-muted-foreground">Open for student applications</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Student Pitches
            </span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <p className="font-mono text-3xl font-medium text-foreground">
            {loading ? "..." : error ? "-" : totalPendingPitches}
          </p>
          <p className="text-xs text-muted-foreground">Ready for side-by-side review</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              AI Matching Engine
            </span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground mt-2">Active Multi-Signal</p>
          <p className="text-xs text-muted-foreground">Automatic distance & similarity check</p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">{error}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => void loadReviews()}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Actionable Intake Stream</h2>
          <Link
            href="/government/manage"
            className="inline-flex min-h-10 items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Go to full workspace <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card/60" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-8 text-center text-sm text-destructive">
            Data is currently unavailable.
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-semantic-up" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-medium text-foreground">No reports requiring triage</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              New community complaints will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map(({ problem, pendingApplicationCount, applicationCount }) => (
              <div
                key={problem.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:border-primary/40"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase text-primary">
                      {problem.category.replace("_", " ")}
                    </span>
                    <span className="rounded-full border border-border bg-surface-soft px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                      {problem.status.replace("_", " ")}
                    </span>
                    {problem.district && (
                      <span className="text-xs text-muted-foreground">
                        • {problem.district}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-foreground line-clamp-1">
                    {problem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right font-mono text-xs">
                    <p className="font-medium text-foreground">{pendingApplicationCount} pitches</p>
                    <p className="text-[10px] text-muted-foreground">{applicationCount} total submitted</p>
                  </div>
                  <Link
                    href="/government/manage"
                    className="inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Triage <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
