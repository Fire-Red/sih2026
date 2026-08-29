"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  Circle,
  MapPin,
  Play,
  Users,
} from "lucide-react";
import { MilestoneCard, Milestone } from "./milestone-card";
import { Button } from "@/components/ui/button";

interface Problem {
  title: string;
  district: string;
  category: string;
}

interface Project {
  id: string;
  title: string;
  status: "active" | "prototype" | "pilot" | "completed" | "blocked";
  teamName: string;
  institutionName: string;
  district: string;
  startDate: string;
  pitchSummary: string;
  videoUrl: string;
  pilotDistrict?: string;
  pilotDescription?: string;
  problem: Problem;
  milestones: Milestone[];
}

const STATUS_CLASSES: Record<Project["status"], string> = {
  active: "bg-primary/10 text-primary",
  prototype: "bg-accent text-accent-foreground",
  pilot: "bg-semantic-up/10 text-semantic-up",
  completed: "bg-muted text-muted-foreground",
  blocked: "bg-destructive/10 text-destructive",
};

function ProjectStatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_CLASSES[status]}`}
    >
      {status}
    </span>
  );
}

function formatStartDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const MOCK_PROJECT: Project = {
  id: "1",
  title: "Groundwater remediation and solar filtration system",
  status: "active",
  teamName: "Team Hydra",
  institutionName: "Applied engineering institute",
  district: "Central district",
  startDate: "2026-09-01",
  pitchSummary:
    "We will deploy a solar-powered multi-stage filtration unit at 4 identified bore wells, with IoT sensors transmitting real-time water quality data to a government dashboard.",
  videoUrl: "#",
  pilotDistrict: "Central district",
  pilotDescription: "The first pilot targets two bore wells in the selected area.",
  problem: {
    title: "Groundwater contamination in an industrial belt",
    district: "Central district",
    category: "Water & Sanitation",
  },
  milestones: [
    {
      id: "m1",
      title: "Site survey and water quality baseline measurement",
      dueDate: "2026-09-15",
      status: "completed",
      notes: "Completed. Data uploaded to shared drive.",
    },
    {
      id: "m2",
      title: "Filtration unit procurement and testing",
      dueDate: "2026-10-30",
      status: "in_progress",
      notes: "Unit received from vendor. Lab tests underway.",
    },
    {
      id: "m3",
      title: "First bore well installation (Topchanchi)",
      dueDate: "2026-11-30",
      status: "pending",
    },
    {
      id: "m4",
      title: "IoT sensor deployment and dashboard integration",
      dueDate: "2026-12-31",
      status: "pending",
    },
    {
      id: "m5",
      title: "Pilot monitoring period (30 days)",
      dueDate: "2027-01-31",
      status: "pending",
    },
    {
      id: "m6",
      title: "Impact measurement and government verification",
      dueDate: "2027-03-15",
      status: "pending",
    },
  ],
};

interface ProjectWorkspaceProps {
  projectId: string;
}

export function ProjectWorkspace({ projectId: _projectId }: ProjectWorkspaceProps) {
  const project = MOCK_PROJECT;
  const completedCount = project.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const totalCount = project.milestones.length;
  const pilotStarted = Boolean(project.pilotDistrict);
  const truncatedTitle =
    project.title.length > 48
      ? project.title.slice(0, 48) + "…"
      : project.title;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 h-14 bg-background border-b border-border flex items-center px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <Circle className="h-2 w-2 fill-primary text-primary" />
          CivicPulse
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-2" />
        <Link
          href="/problems"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Problems
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-2" />
        <span className="text-xs text-foreground">{truncatedTitle}</span>
        <div className="ml-auto">
          <ProjectStatusBadge status={project.status} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-light tracking-[-0.03em] text-foreground">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {project.teamName}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {project.institutionName}
            </span>
            <span className="flex items-center gap-1.5 tnum">
              <Calendar className="h-3.5 w-3.5" />
              Started {formatStartDate(project.startDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {project.district}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-foreground">
                Milestones
              </h2>
              <span className="text-xs text-muted-foreground tnum">
                {completedCount} of {totalCount} complete
              </span>
            </div>
            {project.milestones.map((m) => (
              <MilestoneCard key={m.id} milestone={m} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-xs font-medium text-muted-foreground mb-3">
                Source problem
              </h3>
              <p className="text-sm font-medium text-foreground">
                {project.problem.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {project.problem.district} · {project.problem.category}
              </p>
              <Link
                href="/problems"
                className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
              >
                View problem <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-xs font-medium text-muted-foreground mb-3">
                Selected application
              </h3>
              <p className="text-sm font-medium text-foreground">
                {project.teamName}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                {project.pitchSummary}
              </p>
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
              >
                <Play className="h-3 w-3" />
                Watch pitch video
              </a>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-xs font-medium text-muted-foreground mb-3">
                Pilot deployment
              </h3>
              <p className="text-xs text-muted-foreground">
                {project.pilotDistrict ?? "Not started"}
              </p>
              {project.pilotDescription && (
                <p className="text-sm text-foreground mt-2 font-light">
                  {project.pilotDescription}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
