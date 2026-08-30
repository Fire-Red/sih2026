"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getReviewDetail,
  getSimilarReports,
  publishProblemStatement,
  selectReviewWinner,
  updateSimilarReviewMode,
  updateReportStatus,
} from "@/lib/api/government-review-api";
import type {
  ReviewApplication,
  ReviewDetail,
  SimilarReportMatch,
} from "@/types/government-review";
import { ReportEvidenceGallery } from "./report-evidence-gallery";
import { AiSimilarReportsCard } from "./ai-similar-reports-card";
import { ProblemStatementPublisher } from "./problem-statement-publisher";
import { ApplicationPitchMatrix } from "./application-pitch-matrix";
import { CivicAiAssistant } from "./civic-ai-assistant";
import { GovernmentAiEvidence } from "./government-ai-evidence";
import { getVerifiedSolutions } from "@/lib/api/ai-api";
import type { SolutionMemoryItem } from "@/lib/api/ai-api";

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

export function GovernmentProblemDetail({ problemId }: { problemId: string }) {
  const router = useRouter();
  const [detail, setDetail] = useState<ReviewDetail | null>(null);
  const [similarReports, setSimilarReports] = useState<SimilarReportMatch[]>([]);
  const [selectedMergeIds, setSelectedMergeIds] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ReviewApplication | null>(null);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [solutions, setSolutions] = useState<SolutionMemoryItem[]>([]);
  const [solutionsLoading, setSolutionsLoading] = useState(false);
  const [solutionsError, setSolutionsError] = useState<string | null>(null);
  const [reviewModeSaving, setReviewModeSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [successProjectId, setSuccessProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
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

      setSolutionsLoading(true);
      setSolutionsError(null);
      try {
        setSolutions(await getVerifiedSolutions(`${data.problem.title} ${data.problem.description}`));
      } catch (solutionError: unknown) {
        setSolutionsError(solutionError instanceof Error ? solutionError.message : "Solution memory is unavailable.");
      } finally {
        setSolutionsLoading(false);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const handleStatusChange = async (
    status: "submitted" | "under_review" | "validated" | "rejected"
  ) => {
    if (!detail) return;
    setSubmitting(true);
    try {
      await updateReportStatus(detail.problem.id, status);
      setDetail((prev) => (prev ? { ...prev, problem: { ...prev.problem, status } } : null));
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
    setPublishModalOpen(false);
  };

  const openSelection = (application: ReviewApplication) => {
    setSelectedApplication(application);
    setNotes("");
    dialogRef.current?.showModal();
  };

  const closeSelection = () => {
    dialogRef.current?.close();
  };

  const confirmSelection = async () => {
    if (!detail || !selectedApplication) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await selectReviewWinner(
        detail.problem.id,
        selectedApplication.id,
        notes.trim()
      );
      setSuccessProjectId(result.projectId);
      closeSelection();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReviewMode = async () => {
    if (!detail) return;
    const mode = detail.problem.similarReviewMode === "queue_high_confidence" ? "manual_review" : "queue_high_confidence";
    setReviewModeSaving(true);
    try {
      await updateSimilarReviewMode(detail.problem.id, mode);
      setDetail((previous) => previous ? { ...previous, problem: { ...previous.problem, similarReviewMode: mode } } : null);
    } catch (modeError: unknown) {
      setError(modeError instanceof Error ? modeError.message : "Unable to update review mode.");
    } finally {
      setReviewModeSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse bg-neutral-100 rounded" />
        <div className="h-64 animate-pulse bg-neutral-100 rounded-xl" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
        <AlertCircle className="mx-auto h-6 w-6 text-rose-600" />
        <p className="text-xs text-rose-700">{error || "Problem detail not found"}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const { problem, evidence, applications } = detail;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-neutral-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-neutral-900 truncate">
                {problem.title}
              </h1>
              <Badge variant="secondary">{problem.status.replace("_", " ")}</Badge>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Reference #{problem.id.slice(0, 8)} • Reported {new Date(problem.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {problem.status === "submitted" && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={submitting}
                onClick={() => handleStatusChange("rejected")}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={submitting}
                onClick={() => handleStatusChange("under_review")}
              >
                Validate
              </Button>
            </>
          )}

          <Button
            size="sm"
            onClick={() => setPublishModalOpen(true)}
            disabled={submitting}
            className="bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Publish challenge
          </Button>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void toggleReviewMode()} disabled={reviewModeSaving}>
          {reviewModeSaving ? "Saving..." : detail.problem.similarReviewMode === "queue_high_confidence" ? "Auto queue: on" : "Auto queue: off"}
        </Button>
      </div>

      {successProjectId && (
        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-neutral-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium">Challenge awarded successfully. Active project workspace created.</span>
          </div>
          <Link href={`/projects/${successProjectId}`}>
            <Button size="sm" className="bg-neutral-900 text-white">
              View project
            </Button>
          </Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-neutral-900">Problem details</h2>
            <div className="rounded-xl border border-neutral-200/80 p-5 space-y-4 bg-white">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{problem.category.replace("_", " ")}</Badge>
                <Badge variant="outline">{problem.severity} severity</Badge>
                {problem.district && <Badge variant="outline">{problem.district}</Badge>}
              </div>
              <p className="text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {problem.description}
              </p>
              {(problem.latitude || problem.longitude) && (
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
                  <span>Coordinates:</span>
                  <span className="font-mono text-neutral-700">
                    {problem.latitude}, {problem.longitude}
                  </span>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-neutral-900">Submitted evidence</h2>
            <ReportEvidenceGallery evidence={evidence} />
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-neutral-900">Related report clustering</h2>
            <AiSimilarReportsCard
              loading={similarLoading}
              matches={similarReports}
              selectedReportIds={selectedMergeIds}
              onToggleSelect={toggleMergeSelect}
              onOpenMergeDialog={() => setPublishModalOpen(true)}
            />
          </section>
          <CivicAiAssistant
            context={`Problem title: ${problem.title}\nProblem description: ${problem.description}\n\nRelated reports:\n${similarReports.map((report) => `- ${report.title} (${report.distanceKm ?? "distance unavailable"} km, submitted ${report.createdAt ?? "date unavailable"})`).join("\n") || "No related reports found."}\n\nPrior verified solutions:\n${solutions.map((solution) => `- ${solution.approach}`).join("\n") || "No verified prior solution found."}`}
            district={problem.district}
          />
          <GovernmentAiEvidence
            matches={similarReports}
            solutions={solutions}
            solutionsLoading={solutionsLoading}
            solutionsError={solutionsError}
          />
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-neutral-900">Student team pitches</h2>
            <div className="rounded-xl border border-neutral-200/80 bg-white p-3">
              <ApplicationPitchMatrix
                applications={applications}
                disabled={submitting || Boolean(problem.selectedTeamId)}
                onSelectWinner={openSelection}
              />
            </div>
          </section>
        </div>
      </div>

      <ProblemStatementPublisher
        primaryProblem={problem}
        selectedSimilarReports={similarReports.filter((r) =>
          selectedMergeIds.includes(r.id)
        )}
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublish={handlePublishProblemStatement}
      />

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl backdrop:bg-black/40"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-neutral-900">
              Award to {selectedApplication?.teamName}
            </h2>
            <p className="text-xs text-neutral-500">
              This assigns {selectedApplication?.teamName} and initializes the active project workspace.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="review-notes" className="text-xs font-medium text-neutral-700">
              Decision notes (optional)
            </label>
            <textarea
              id="review-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              rows={3}
              placeholder="Record approval context..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <Button variant="ghost" size="sm" onClick={closeSelection} disabled={submitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => void confirmSelection()}
              disabled={submitting}
              className="bg-neutral-900 text-white hover:bg-neutral-800"
            >
              {submitting ? "Saving..." : "Confirm award"}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
