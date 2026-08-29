"use client";

import React, { useEffect, useRef } from "react";
import { X, Upload, Video, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Problem } from "./problem-card";

interface ApplicationDrawerProps {
  problem: Problem | null;
  onClose: () => void;
}

export function ApplicationDrawer({ problem, onClose }: ApplicationDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (problem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [problem]);

  if (!problem) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Apply with team"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border flex flex-col shadow-2xl"
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground font-light">Applying to</p>
            <h2 className="mt-0.5 text-[15px] font-medium text-foreground leading-snug line-clamp-2">
              {problem.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Team name</label>
            <Input placeholder="e.g. Team Innovate" className="h-9 text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Institution</label>
            <Input placeholder="College or university name" className="h-9 text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Pitch summary
            </label>
            <textarea
              rows={4}
              placeholder="Describe your proposed solution approach in 2–3 sentences."
              className="w-full rounded-[6px] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary resize-none font-light"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" />
              Pitch video link
            </label>
            <Input
              type="url"
              placeholder="YouTube or Google Drive URL"
              className="h-9 text-sm"
            />
            <p className="text-xs text-muted-foreground font-light">
              Max 3 minutes. Unlisted links accepted.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <FileUp className="h-3.5 w-3.5" />
              Presentation deck
            </label>
            <div className="flex items-center gap-3 border border-dashed border-border rounded-xl px-4 py-5 bg-muted">
              <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-foreground font-light">
                  Drop your PPT or PDF here
                </p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">
                  .pptx or .pdf, max 20 MB
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Lead contact email
            </label>
            <Input
              type="email"
              placeholder="team-lead@college.edu"
              className="h-9 text-sm"
            />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-light">
            <span className="tnum">{problem.maxTeams - problem.appliedTeams}</span>{" "}
            slot{problem.maxTeams - problem.appliedTeams !== 1 ? "s" : ""} remaining
          </p>
          <Button
            type="submit"
            className="h-9 px-5 rounded-full text-xs font-medium"
            onClick={onClose}
          >
            Submit application
          </Button>
        </div>
      </div>
    </>
  );
}
