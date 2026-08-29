"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Problem {
  title: string;
  district: string;
  category: string;
}

interface ProjectSidebarProps {
  problem: Problem;
  teamName: string;
  pitchSummary: string;
  videoUrl: string;
  pilotDistrict?: string;
  pilotDescription?: string;
}

function SidebarCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-xs font-medium text-muted-foreground mb-3">
        {label}
      </h3>
      {children}
    </div>
  );
}

export function ProjectSidebar({
  problem,
  teamName,
  pitchSummary,
  videoUrl,
  pilotDistrict,
  pilotDescription,
}: ProjectSidebarProps) {
  const pilotStarted = Boolean(pilotDistrict);

  return (
    <div className="space-y-4">
      <SidebarCard label="Source problem">
        <p className="text-sm font-medium text-foreground">{problem.title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {problem.district} · {problem.category}
        </p>
        <Link
          href="/problems"
          className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
        >
          View problem <ArrowRight className="h-3 w-3" />
        </Link>
      </SidebarCard>

      <SidebarCard label="Selected application">
        <p className="text-sm font-medium text-foreground">{teamName}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
          {pitchSummary}
        </p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
        >
          <Play className="h-3 w-3" />
          Watch pitch video
        </a>
      </SidebarCard>

      <SidebarCard label="Pilot deployment">
        <p className="text-xs text-muted-foreground">
          {pilotDistrict ?? "Not started"}
        </p>
        {pilotDescription && (
          <p className="text-sm text-foreground mt-2 font-light">
            {pilotDescription}
          </p>
        )}
        {!pilotStarted && (
          <Button
            variant="outline"
            className="mt-4 w-full h-9 rounded-full text-xs"
          >
            Record pilot start
          </Button>
        )}
      </SidebarCard>
    </div>
  );
}
