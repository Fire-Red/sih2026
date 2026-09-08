"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowRight, BellRing, MapPin, ClipboardList, Search, FolderKanban, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getReviewQueue, getSimilarityAlerts } from "@/lib/api/government-review-api";
import type { ReviewQueueItem, SimilarityAlert } from "@/types/government-review";

export function GovernmentDashboardView() {
  const [reviews, setReviews] = useState<ReviewQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<SimilarityAlert[]>([]);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [queue, similarityAlerts] = await Promise.all([getReviewQueue(), getSimilarityAlerts()]);
      setReviews(queue);
      setAlerts(similarityAlerts);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error ? requestError.message : "Unable to load review data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadReviews(), 0);
    return () => window.clearTimeout(timer);
  }, [loadReviews]);

  const newComplaintsCount = reviews.filter((r) => r.problem.status === "submitted").length;
  const activeChallengesCount = reviews.filter(
    (r) => r.problem.status === "validated" && !r.problem.selectedTeamId
  ).length;
  const totalPendingPitches = reviews.reduce((acc, curr) => acc + curr.pendingApplicationCount, 0);
  const activeProjectsCount = reviews.filter((r) => Boolean(r.problem.selectedTeamId)).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/80 pb-6">
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-1">
            Officer overview
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Decision dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Intake stream, active challenges, and pending student team proposals.
          </p>
        </div>
        <Link href="/government/manage">
          <Button className="bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5">
            Open review console <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <nav aria-label="Government workspace" className="grid gap-2 sm:grid-cols-4">
        <Link href="/government/manage" className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted">
          <ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" /> Review intake
        </Link>
        <Link href="/government/manage" className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted">
          <Search className="h-4 w-4 text-primary" aria-hidden="true" /> Similar reports
        </Link>
        <Link href="/government/manage" className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted">
          <FolderKanban className="h-4 w-4 text-primary" aria-hidden="true" /> Challenges
        </Link>
        <Link href="/government/manage" className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted">
          <Settings2 className="h-4 w-4 text-primary" aria-hidden="true" /> Review settings
        </Link>
      </nav>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 border-b border-neutral-200/80 pb-8">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-neutral-900">
            {loading ? "-" : error ? "-" : newComplaintsCount}
          </p>
          <span className="text-xs text-neutral-500 mt-1 block">
            New intake
          </span>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight text-neutral-900">
            {loading ? "-" : error ? "-" : activeChallengesCount}
          </p>
          <span className="text-xs text-neutral-500 mt-1 block">
            Published challenges
          </span>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight text-neutral-900">
            {loading ? "-" : error ? "-" : totalPendingPitches}
          </p>
          <span className="text-xs text-neutral-500 mt-1 block">
            Pending pitches
          </span>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight text-neutral-900">
            {loading ? "-" : error ? "-" : activeProjectsCount}
          </p>
          <span className="text-xs text-neutral-500 mt-1 block">
            Active projects
          </span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">{error}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => void loadReviews()}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Retry
          </Button>
        </div>
      )}

      {alerts.length > 0 && (
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <BellRing className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-medium text-foreground">High confidence report matches</h2>
              <p className="mt-1 text-xs text-muted-foreground">New reports are ready for officer review. No report has been merged automatically.</p>
            </div>
          </div>
          <div className="mt-4 divide-y divide-primary/10 border-t border-primary/10">
            {alerts.slice(0, 5).map((alert) => (
              <Link key={alert.relationship.id} href={`/government/manage/${alert.relationship.reportId}`} className="flex items-center justify-between gap-4 py-3 text-xs hover:underline">
                <span className="min-w-0 truncate font-medium text-foreground">{alert.relatedReport.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-muted-foreground"><MapPin className="h-3 w-3" />{alert.relationship.geographicDistanceKm ? `${alert.relationship.geographicDistanceKm} km` : "Distance unavailable"}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Recent intake stream
          </h2>
          <Link
            href="/government/manage"
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            Loading intake stream...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-neutral-200 p-8 text-center text-xs text-neutral-500">
            Data is currently unavailable.
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-xs text-neutral-500">
            No incoming reports in the queue.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="py-2.5 px-4 font-medium text-neutral-500">
                    Title
                  </th>
                  <th className="py-2.5 px-4 font-medium text-neutral-500">
                    Category
                  </th>
                  <th className="py-2.5 px-4 font-medium text-neutral-500">
                    District
                  </th>
                  <th className="py-2.5 px-4 font-medium text-neutral-500">
                    Date
                  </th>
                  <th className="py-2.5 px-4 font-medium text-neutral-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reviews.slice(0, 8).map(({ problem }) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-neutral-900 font-medium max-w-[240px] truncate">
                      <Link href={`/government/manage/${problem.id}`} className="hover:underline">
                        {problem.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {problem.category.replace("_", " ")}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {problem.district || "General"}
                    </td>
                    <td className="py-3 px-4 text-neutral-400">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">
                        {problem.status.replace("_", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
