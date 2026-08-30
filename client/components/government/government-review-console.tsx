"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Send,
  XCircle,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InboxIcon,
  ChallengeIcon,
  TrophyAwardIcon,
  PinLocationIcon,
} from "@/components/ui/civic-icons";
import {
  getReviewDetail,
  getReviewQueue,
  getSimilarReports,
  publishProblemStatement,
  selectReviewWinner,
  updateReportStatus,
} from "@/lib/api/government-review-api";
import { getSession } from "@/lib/auth/session";
import type {
  ReviewApplication,
  ReviewDetail,
  ReviewQueueItem,
  SimilarReportMatch,
} from "@/types/government-review";
import { ReportEvidenceGallery } from "./report-evidence-gallery";
import { AiSimilarReportsCard } from "./ai-similar-reports-card";
import { ProblemStatementPublisher } from "./problem-statement-publisher";
import { ApplicationPitchMatrix } from "./application-pitch-matrix";

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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function GovernmentReviewConsole() {
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabStage>("intake");
  const [detail, setDetail] = useState<ReviewDetail | null>(null);
  const [similarReports, setSimilarReports] = useState<SimilarReportMatch[]>([]);
  const [selectedMergeIds, setSelectedMergeIds] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ReviewApplication | null>(null);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [successProjectId, setSuccessProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const loadDetail = useCallback(async (problemId: string) => {
    setDetailLoading(true);
    setError(null);
    setSelectedMergeIds([]);
    try {
      const data = await getReviewDetail(problemId);
      setDetail(data);

      setSimilarLoading(true);
      try {
        const matches = await getSimilarReports(
          data.problem.id,
          `${data.problem.title} ${data.problem.description}`,
          data.problem.category,
          data.problem.latitude,
          data.problem.longitude
        );
        setSimilarReports(matches);
      } catch {
        setSimilarReports([]);
      } finally {
        setSimilarLoading(false);
      }
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
      if (!session || (session.role !== "government" && session.role !== "admin")) {
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

  const handleStatusChange = async (
    status: "submitted" | "under_review" | "validated" | "rejected"
  ) => {
    if (!detail) return;
    setSubmitting(true);
    try {
      await updateReportStatus(detail.problem.id, status);
      setDetail((prev) => (prev ? { ...prev, problem: { ...prev.problem, status } } : null));
      setQueue((prev) =>
        prev.map((item) =>
          item.problem.id === detail.problem.id
            ? { ...item, problem: { ...item.problem, status } }
            : item
        )
      );
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMergeSelect = (id: string) => {
    setSelectedMergeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePublishProblemStatement = async (payload: {
    title: string;
    description: string;
    maxTeamsAllowed: number;
    sponsoringDepartment?: string;
    grantAmount?: string;
  }) => {
    if (!detail) return;
    const res = await publishProblemStatement({
      problemId: detail.problem.id,
      mergedReportIds: selectedMergeIds,
      ...payload,
    });
    setDetail((prev) => (prev ? { ...prev, problem: res.problem } : null));
    setQueue((prev) =>
      prev.map((item) =>
        item.problem.id === detail.problem.id
          ? { ...item, problem: res.problem }
          : item
      )
    );
  };

  const openSelection = (application: ReviewApplication) => {
    setSelectedApplication(application);
    setNotes("");
    triggerRef.current =
      document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
    dialogRef.current?.showModal();
  };

  const closeSelection = () => {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  };

  const confirmSelection = async () => {
    if (!detail || !selectedApplication) return;
    const completedProblemId = detail.problem.id;
    setSubmitting(true);
    setError(null);
    try {
      const result = await selectReviewWinner(
        completedProblemId,
        selectedApplication.id,
        notes.trim()
      );
      setSuccessProjectId(result.projectId);
      closeSelection();
      const remaining = queue.filter((item) => item.problem.id !== completedProblemId);
      setQueue(remaining);
      if (remaining.length > 0) {
        await loadDetail(remaining[0].problem.id);
      } else {
        setDetail(null);
      }
    } catch (requestError: unknown) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const intakeCount = queue.filter((r) => r.problem.status === "submitted" || r.problem.status === "under_review").length;
  const challengeCount = queue.filter((r) => r.problem.status === "validated" && !r.problem.selectedTeamId).length;
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
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
        <div className="w-full text-center space-y-4">
          <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-xl font-medium tracking-tight">Government access required</h1>
          <p className="text-xs text-muted-foreground">Sign in with an authorized officer account.</p>
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-[92rem] space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
            Officer Workspace
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review community issues, inspect photos, and assign challenges to student teams.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-surface-soft/60 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("intake")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "intake"
                ? "bg-surface text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <InboxIcon className="h-3.5 w-3.5 text-primary" />
            Intake ({intakeCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("challenges")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "challenges"
                ? "bg-surface text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ChallengeIcon className="h-3.5 w-3.5 text-primary" />
            Open Challenges ({challengeCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("awarded")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "awarded"
                ? "bg-surface text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrophyAwardIcon className="h-3.5 w-3.5 text-primary" />
            Awarded ({awardedCount})
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-3 rounded-lg bg-destructive/5 p-3.5 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex-1">{error}</div>
          <Button type="button" variant="outline" size="sm" onClick={() => void loadQueue()} className="h-7 text-xs">
            <RefreshCw className="mr-1.5 h-3 w-3" /> Retry
          </Button>
        </div>
      )}

      {successProjectId && (
        <div role="status" className="flex items-center justify-between rounded-lg bg-semantic-up/10 p-3.5 text-xs text-semantic-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Challenge successfully awarded. Active milestone workspace created.</span>
          </div>
          <Link className="inline-flex items-center gap-1 font-medium underline underline-offset-2" href={`/projects/${successProjectId}`}>
            Open Workspace <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-soft/60" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-lg bg-surface-soft/60" />
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center space-y-2">
          <CheckCircle2 className="mx-auto h-7 w-7 text-semantic-up" aria-hidden="true" />
          <h3 className="text-sm font-medium text-foreground">Queue is clear</h3>
          <p className="text-xs text-muted-foreground">No reports found in this stage.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] items-start">
          <aside aria-label="Complaints queue" className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredQueue.map((item) => {
              const isActive = detail?.problem.id === item.problem.id;
              return (
                <button
                  key={item.problem.id}
                  type="button"
                  onClick={() => void loadDetail(item.problem.id)}
                  className={`w-full rounded-xl p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/80 bg-card hover:bg-surface-soft"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] uppercase text-primary font-medium">
                      {item.problem.category.replace("_", " ")}
                    </span>
                    <span className="rounded-full bg-surface-soft px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                      {item.problem.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="mt-1 line-clamp-1 text-xs font-medium text-foreground">
                    {item.problem.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                    {item.problem.district || "Local area"}
                  </p>

                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground pt-1.5 border-t border-border/40">
                    <span>{item.pendingApplicationCount} pitches</span>
                    <span className="capitalize">{item.problem.severity}</span>
                  </div>
                </button>
              );
            })}
          </aside>

          <section aria-live="polite" className="space-y-4">
            {detailLoading || !detail ? (
              <div className="h-80 animate-pulse rounded-xl bg-surface-soft/60" />
            ) : (
              <>
                <div className="rounded-xl border border-border/80 bg-card p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase text-primary font-medium">
                        {detail.problem.category.replace("_", " ")}
                      </span>
                      <span className="rounded-full bg-surface-soft px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {detail.problem.severity} severity
                      </span>
                      {detail.problem.district && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <PinLocationIcon className="h-3 w-3 text-primary" />
                          {detail.problem.district}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {detail.problem.status === "submitted" && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={submitting}
                            onClick={() => handleStatusChange("rejected")}
                            className="h-8 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="mr-1 h-3.5 w-3.5" />
                            Reject
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={submitting}
                            onClick={() => handleStatusChange("under_review")}
                            className="h-8 text-xs"
                          >
                            Mark Review
                          </Button>
                        </>
                      )}

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setPublishModalOpen(true)}
                        className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary-hover"
                      >
                        <Send className="mr-1.5 h-3 w-3" />
                        Publish Challenge
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-foreground tracking-tight">
                      {detail.problem.title}
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {detail.problem.description}
                    </p>
                  </div>

                  <ReportEvidenceGallery evidence={detail.evidence} />

                  <AiSimilarReportsCard
                    loading={similarLoading}
                    matches={similarReports}
                    selectedReportIds={selectedMergeIds}
                    onToggleSelect={toggleMergeSelect}
                    onOpenMergeDialog={() => setPublishModalOpen(true)}
                  />
                </div>

                <ApplicationPitchMatrix
                  applications={detail.applications}
                  disabled={submitting || Boolean(detail.problem.selectedTeamId)}
                  onSelectWinner={openSelection}
                />

                <ProblemStatementPublisher
                  primaryProblem={detail.problem}
                  selectedSimilarReports={similarReports.filter((r) =>
                    selectedMergeIds.includes(r.id)
                  )}
                  open={publishModalOpen}
                  onClose={() => setPublishModalOpen(false)}
                  onPublish={handlePublishProblemStatement}
                />
              </>
            )}
          </section>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="selection-dialog-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/50"
      >
        <div className="space-y-4 p-6">
          <div className="space-y-1">
            <h2 id="selection-dialog-title" className="text-base font-medium text-foreground">
              Award to {selectedApplication?.teamName}
            </h2>
            <p className="text-xs text-muted-foreground">
              This assigns {selectedApplication?.teamName} and initializes the active milestone workspace.
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="review-notes" className="text-xs font-medium text-foreground">
              Decision Notes (Optional)
            </label>
            <textarea
              id="review-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={2000}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Record approval context..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={closeSelection} disabled={submitting} className="h-8 text-xs">
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={() => void confirmSelection()} disabled={submitting} className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary-hover">
              <TrophyAwardIcon className="mr-1.5 h-3.5 w-3.5" />
              {submitting ? "Saving..." : "Confirm & Award"}
            </Button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
