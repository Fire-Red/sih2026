"use client";

import { AlertCircle, CheckCircle2, Circle } from "lucide-react";

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  notes?: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
}

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const borderClass: Record<Milestone["status"], string> = {
  completed: "border-border opacity-80",
  overdue: "border-destructive/40",
  in_progress: "border-primary/40",
  pending: "border-border",
};

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { title, dueDate, status, notes } = milestone;

  return (
    <div
      className={`bg-card border rounded-xl p-4 flex items-start gap-4 ${borderClass[status]}`}
    >
      <div className="mt-0.5 shrink-0">
        {status === "completed" && (
          <CheckCircle2 className="h-4 w-4 text-semantic-up" />
        )}
        {status === "in_progress" && (
          <Circle className="h-4 w-4 text-primary" />
        )}
        {status === "overdue" && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
        {status === "pending" && (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p
            className={`text-sm font-medium ${
              status === "completed"
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {title}
          </p>
          <span className="text-xs text-muted-foreground tnum shrink-0">
            {formatDueDate(dueDate)}
          </span>
        </div>
        {notes && (
          <p className="mt-1 text-xs text-muted-foreground font-light">
            {notes}
          </p>
        )}
      </div>
    </div>
  );
}
