"use client";

import React from "react";
import { MapPin, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Problem {
  id: string;
  title: string;
  district: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  reportCount: number;
  maxTeams: number;
  appliedTeams: number;
  sponsoringDept?: string;
  summary: string;
}

interface ProblemCardProps {
  problem: Problem;
  onApply: (problem: Problem) => void;
}

function SeverityBadge({ severity }: { severity: Problem["severity"] }) {
  if (severity === "critical") {
    return (
      <span className="text-xs text-destructive font-medium">Critical</span>
    );
  }
  if (severity === "high") {
    return (
      <span className="text-xs text-amber-600 font-medium">High priority</span>
    );
  }
  return null;
}

export function ProblemCard({ problem, onApply }: ProblemCardProps) {
  const {
    title,
    district,
    category,
    severity,
    reportCount,
    maxTeams,
    appliedTeams,
    sponsoringDept,
    summary,
  } = problem;

  const slotsFilled = appliedTeams >= maxTeams;
  const fillPct = Math.min((appliedTeams / maxTeams) * 100, 100);

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-primary/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 bg-muted border border-border rounded-full text-muted-foreground">
            {category}
          </span>
          <SeverityBadge severity={severity} />
        </div>

        <h3 className="text-[15px] font-medium text-foreground leading-snug">
          {title}
        </h3>

        <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
          {summary}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {district}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="tnum">{reportCount}</span>&nbsp;reports
          </span>
          {sponsoringDept && (
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              {sponsoringDept}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Team slots</p>
          <p className="text-sm font-medium text-foreground tnum">
            {appliedTeams} of {maxTeams} filled
          </p>
          <div className="mt-1 w-24 h-1 rounded-full bg-border">
            <div
              className="h-1 rounded-full bg-primary transition-all"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {slotsFilled ? (
          <span className="text-xs text-muted-foreground px-3 py-1.5 border border-border rounded-full">
            All slots filled
          </span>
        ) : (
          <Button
            className="h-9 px-4 rounded-full text-xs font-medium"
            onClick={() => onApply(problem)}
          >
            Apply with team
          </Button>
        )}
      </div>
    </div>
  );
}
