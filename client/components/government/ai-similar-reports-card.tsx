"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiSparkleIcon, PinLocationIcon } from "@/components/ui/civic-icons";
import type { SimilarReportMatch } from "@/types/government-review";

interface AiSimilarReportsCardProps {
  loading: boolean;
  matches: SimilarReportMatch[];
  selectedReportIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenMergeDialog: () => void;
}

export function AiSimilarReportsCard({
  loading,
  matches,
  selectedReportIds,
  onToggleSelect,
  onOpenMergeDialog,
}: AiSimilarReportsCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-surface-soft/60 px-4 py-3 text-xs text-muted-foreground">
        <AiSparkleIcon className="h-4 w-4 animate-spin text-primary" />
        <span>Scanning nearby complaints for matching issues...</span>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-surface-soft/40 px-4 py-2.5 text-xs text-muted-foreground">
        <AiSparkleIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
        <span>No matching nearby complaints found.</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-left focus-visible:outline-none"
        >
          <AiSparkleIcon className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-medium text-foreground">
            {matches.length} Related Reports Found Nearby
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
            {Math.round(matches[0]?.similarity * 100)}% match
          </span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {selectedReportIds.length > 0 && (
            <Button
              type="button"
              size="sm"
              onClick={onOpenMergeDialog}
              className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Layers className="mr-1 h-3 w-3" />
              Merge ({selectedReportIds.length + 1}) & Publish
            </Button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            {expanded ? "Hide" : "Review & Merge"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-primary/10 pt-3">
          <p className="text-[11px] text-muted-foreground">
            Select complaints to consolidate them into a single official challenge:
          </p>

          <div className="space-y-1.5">
            {matches.map((item) => {
              const isSelected = selectedReportIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onToggleSelect(item.id)}
                  className={`flex cursor-pointer items-start justify-between gap-3 rounded-lg p-2.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-primary/15 font-medium text-foreground"
                      : "bg-surface/80 hover:bg-surface text-muted-foreground"
                  }`}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase text-primary">
                        {Math.round(item.similarity * 100)}% match
                      </span>
                      {item.distanceKm !== null && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                          <PinLocationIcon className="h-3 w-3" />
                          {item.distanceKm} km
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground font-medium truncate">{item.title}</p>
                    <p className="line-clamp-1 text-[11px] opacity-80">{item.description}</p>
                  </div>

                  <div
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
