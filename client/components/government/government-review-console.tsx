"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getReviewQueue } from "@/lib/api/government-review-api";
import { getSession } from "@/lib/auth/session";
import type { ReviewQueueItem } from "@/types/government-review";

type TabStage = "intake" | "challenges" | "awarded";

function errorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof error.error === "string"
  ) {
    return error.error;
  }
  return "Something went wrong while loading this review.";
}

export function GovernmentReviewConsole() {
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabStage>("intake");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

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
    } catch (requestError: unknown) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadQueue(), 0);
    return () => window.clearTimeout(timer);
  }, [loadQueue]);

  const intakeCount = queue.filter(
    (r) => r.problem.status === "submitted" || r.problem.status === "under_review"
  ).length;
  const challengeCount = queue.filter(
    (r) => r.problem.status === "validated" && !r.problem.selectedTeamId
  ).length;
  const awardedCount = queue.filter((r) => Boolean(r.problem.selectedTeamId)).length;

  const filteredQueue = queue.filter((item) => {
    if (activeTab === "intake") {
      return item.problem.status === "submitted" || item.problem.status === "under_review";
    }
    if (activeTab === "challenges") {
      return item.problem.status === "validated" && !item.problem.selectedTeamId;
    }
    if (activeTab === "awarded") {
      return Boolean(item.problem.selectedTeamId);
    }
    return true;
  });

  if (accessDenied) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-md items-center px-4 py-12">
        <div className="w-full text-center space-y-4">
          <ShieldCheck className="mx-auto h-8 w-8 text-neutral-400" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">Government access required</h1>
          <p className="text-xs text-neutral-500">Sign in with an authorized government officer account.</p>
          <Link href="/login">
            <Button size="sm" className="bg-neutral-900 text-white">
              Go to sign in
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full space-y-8">
      <div className="flex flex-col gap-4 border-b border-neutral-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-1">
            Department review
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Review console
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Triage incoming reports, launch challenges, and evaluate student pitches.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("intake")}
            className={`px-3.5 py-1.5 font-medium rounded-full transition-colors ${
              activeTab === "intake"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Intake ({intakeCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("challenges")}
            className={`px-3.5 py-1.5 font-medium rounded-full transition-colors ${
              activeTab === "challenges"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Challenges ({challengeCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("awarded")}
            className={`px-3.5 py-1.5 font-medium rounded-full transition-colors ${
              activeTab === "awarded"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Awarded ({awardedCount})
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-xs text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex-1">{error}</div>
          <Button type="button" variant="outline" size="sm" onClick={() => void loadQueue()} className="h-7 text-xs">
            <RefreshCw className="mr-1.5 h-3 w-3" /> Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 animate-pulse bg-neutral-100 rounded-xl" />
          ))}
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-12 text-center space-y-2">
          <h3 className="text-xs font-medium text-neutral-900">No reports found</h3>
          <p className="text-xs text-neutral-500">Your queue is clear for this stage.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="py-2.5 px-4 font-medium text-neutral-500">
                  Report title
                </th>
                <th className="py-2.5 px-4 font-medium text-neutral-500">
                  Category
                </th>
                <th className="py-2.5 px-4 font-medium text-neutral-500">
                  Location
                </th>
                <th className="py-2.5 px-4 font-medium text-neutral-500">
                  Applications
                </th>
                <th className="py-2.5 px-4 font-medium text-neutral-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredQueue.map((item) => (
                <tr
                  key={item.problem.id}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 max-w-[280px]">
                    <Link
                      href={`/government/manage/${item.problem.id}`}
                      className="block text-neutral-900 font-medium truncate hover:underline"
                    >
                      {item.problem.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-neutral-600 whitespace-nowrap">
                    {item.problem.category.replace("_", " ")}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 truncate max-w-[150px]">
                    {item.problem.district || "General"}
                  </td>
                  <td className="py-3 px-4 text-neutral-600">
                    <span className="font-medium text-neutral-900">
                      {item.pendingApplicationCount}
                    </span>
                    <span className="text-[11px] text-neutral-400 ml-1">
                      pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">
                      {item.problem.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
