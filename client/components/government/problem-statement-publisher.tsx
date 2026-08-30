"use client";

import { useState } from "react";
import { Layers, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReviewProblem, SimilarReportMatch } from "@/types/government-review";

interface ProblemStatementPublisherProps {
  primaryProblem: ReviewProblem;
  selectedSimilarReports: SimilarReportMatch[];
  open: boolean;
  onClose: () => void;
  onPublish: (data: {
    title: string;
    description: string;
    maxTeamsAllowed: number;
    sponsoringDepartment?: string;
    grantAmount?: string;
  }) => Promise<void>;
}

export function ProblemStatementPublisher({
  primaryProblem,
  selectedSimilarReports,
  open,
  onClose,
  onPublish,
}: ProblemStatementPublisherProps) {
  const [prevSyncKey, setPrevSyncKey] = useState("");
  const currentSyncKey = `${primaryProblem.id}:${selectedSimilarReports.map((r) => r.id).join(",")}:${open}`;

  const defaultDescription =
    selectedSimilarReports.length > 0
      ? `${primaryProblem.description}\n\nMerged Community Context:\n` +
        selectedSimilarReports.map((r, i) => `[${i + 1}] ${r.title}: ${r.description}`).join("\n")
      : primaryProblem.description;

  const [title, setTitle] = useState(primaryProblem.title);
  const [description, setDescription] = useState(defaultDescription);
  const [maxTeams, setMaxTeams] = useState(primaryProblem.maxTeamsAllowed || 3);
  const [department, setDepartment] = useState("Urban Development & Civic Infrastructure");
  const [grantAmount, setGrantAmount] = useState("₹50,000 Milestone Grant");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (currentSyncKey !== prevSyncKey && open) {
    setPrevSyncKey(currentSyncKey);
    setTitle(primaryProblem.title);
    setDescription(defaultDescription);
    setMaxTeams(primaryProblem.maxTeamsAllowed || 3);
    setError(null);
  }

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onPublish({
        title: title.trim(),
        description: description.trim(),
        maxTeamsAllowed: Number(maxTeams) || 3,
        sponsoringDepartment: department.trim() || undefined,
        grantAmount: grantAmount.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish problem statement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-medium text-foreground">
                Publish Problem Statement
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Make this challenge open for university and student team applications.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={submitting}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Problem Statement Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Automated IoT Water Quality Monitoring System"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Structured Description & Requirements
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Max Student Teams Allowed
              </label>
              <Input
                type="number"
                min={1}
                max={10}
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Sponsoring Department
              </label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Grant / Pilot Support
              </label>
              <Input
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                placeholder="E.g. ₹50,000"
              />
            </div>
          </div>

          {selectedSimilarReports.length > 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-primary">
                Merging {selectedSimilarReports.length} related report(s):
              </span>
              <ul className="mt-1 list-disc pl-4 space-y-0.5">
                {selectedSimilarReports.map((r) => (
                  <li key={r.id} className="truncate">
                    {r.title} ({r.district || "Local area"})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {submitting ? "Publishing..." : "Publish Statement"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
