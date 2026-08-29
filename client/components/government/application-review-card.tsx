"use client";

import { CheckCircle2, Code, FileText, Play } from "lucide-react";

export interface Application {
  id: string;
  teamName: string;
  institutionName: string;
  memberCount: number;
  members: Array<{ name: string; role: string; year: number }>;
  pitchSummary: string;
  videoUrl: string;
  pptUrl: string;
  repoUrl?: string;
  status: "submitted" | "under_review" | "selected" | "rejected";
  submittedAt: string;
}

interface Props {
  application: Application;
  onSelect: (id: string) => void;
}

function StatusBadge({ status }: { status: Application["status"] }) {
  const map: Record<Application["status"], { label: string; className: string }> = {
    submitted: { label: "Submitted", className: "bg-muted text-muted-foreground" },
    under_review: { label: "Under review", className: "bg-accent text-accent-foreground" },
    selected: { label: "Selected", className: "bg-semantic-up/10 text-semantic-up" },
    rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${className}`}>
      {label}
    </span>
  );
}

export function ApplicationReviewCard({ application, onSelect }: Props) {
  const {
    id,
    teamName,
    institutionName,
    memberCount,
    members,
    pitchSummary,
    videoUrl,
    pptUrl,
    repoUrl,
    status,
  } = application;

  return (
    <div
      className={`bg-card border rounded-xl overflow-hidden flex flex-col ${
        status === "selected" ? "border-primary" : "border-border"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium text-foreground truncate">{teamName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {institutionName}
            <span className="mx-1">·</span>
            <span className="tnum">{memberCount}</span> members
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Approach */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Approach</p>
        <p className="text-sm text-foreground font-light leading-relaxed">{pitchSummary}</p>
      </div>

      {/* Team members */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Team members</p>
        <div className="space-y-1.5">
          {members.map((m) => (
            <div key={m.name} className="flex items-center justify-between text-xs">
              <span className="text-foreground font-medium">{m.name}</span>
              <span className="text-muted-foreground">
                {m.role}
                <span className="mx-1">·</span>Year{" "}
                <span className="tnum">{m.year}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Links + action */}
      <div className="px-5 py-4 flex items-center gap-3 flex-wrap mt-auto">
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-deep transition-colors"
        >
          <Play className="h-3.5 w-3.5" />
          Watch pitch video
        </a>
        <a
          href={pptUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileText className="h-3.5 w-3.5" />
          View deck
        </a>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Code className="h-3.5 w-3.5" />
            Repo
          </a>
        )}

        {status !== "selected" && status !== "rejected" && (
          <button
            onClick={() => onSelect(id)}
            className="ml-auto h-8 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-deep transition-colors"
          >
            Select winning team
          </button>
        )}

        {status === "selected" && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-semantic-up">
            <CheckCircle2 className="h-4 w-4" />
            Selected
          </span>
        )}
      </div>
    </div>
  );
}
