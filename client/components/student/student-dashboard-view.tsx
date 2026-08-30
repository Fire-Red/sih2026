"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/use-user-store";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Video, 
  FileCode, 
  ExternalLink,
  Plus,
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface TeamSummary {
  id: string;
  teamName: string;
  institutionName: string;
  facultyMentorName: string | null;
  members: Array<{ name: string; email: string; role: string }>;
}

interface ApplicationSummary {
  id: string;
  problemId: string;
  problemTitle?: string;
  pitchSummary: string;
  videoUrl: string | null;
  pptUrl: string | null;
  repoUrl: string | null;
  status: "submitted" | "under_review" | "shortlisted" | "selected_winner" | "rejected";
  createdAt: string;
}

export function StudentDashboardView() {
  const user = useUserStore((state) => state.user);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudentData = async () => {
    setLoading(true);
    setError(null);
    let hasError = false;
    try {
      const [teamsRes, appsRes] = await Promise.allSettled([
        fetch("/api/teams"),
        fetch("/api/applications"),
      ]);

      if (teamsRes.status === "fulfilled" && teamsRes.value.ok) {
        const tData = await teamsRes.value.json();
        if (tData.success && Array.isArray(tData.teams)) setTeams(tData.teams);
        else hasError = true;
      } else {
        hasError = true;
      }

      if (appsRes.status === "fulfilled" && appsRes.value.ok) {
        const aData = await appsRes.value.json();
        if (aData.success && Array.isArray(aData.applications)) setApplications(aData.applications);
        else hasError = true;
      } else {
        hasError = true;
      }

      if (hasError) {
        setError("Unable to load all workspace details. You can retry.");
      }
    } catch {
      setError("Unable to load your student workspace data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      await loadStudentData();
      if (!active) return;
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Student & Researcher Workspace</span>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.displayName || "Researcher"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Form teams, submit solution pitches, and track active project milestones.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/problems">
              <Layers className="mr-2 h-4 w-4" />
              Explore Challenges
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/student/teams">
              <Plus className="mr-2 h-4 w-4" />
              Manage Teams
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void loadStudentData()}
            disabled={loading}
            className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">My Teams</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-mono text-2xl font-medium text-foreground">
            {loading ? "..." : teams.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Registered teams where you are leader or member</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pitches Submitted</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-mono text-2xl font-medium text-foreground">
            {loading ? "..." : applications.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Active proposals awaiting or undergoing review</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Awarded Projects</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 font-mono text-2xl font-medium text-foreground">
            {loading ? "..." : applications.filter(a => a.status === "selected_winner").length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Projects transitioning to field pilot milestones</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Active Pitch Submissions</h2>
            <Link href="/problems" className="text-xs text-primary hover:underline">
              Submit new pitch &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
              Loading pitch history...
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <h3 className="mt-3 text-sm font-medium text-foreground">No pitches submitted yet</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Browse validated societal problems, create a team, and submit a 3-minute video pitch with slide deck.
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/problems">Explore Challenges</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase ${
                          app.status === "selected_winner" 
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : app.status === "rejected"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}>
                          {app.status.replace("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Submitted {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-foreground line-clamp-2">
                        {app.pitchSummary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    {app.videoUrl && (
                      <a href={app.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <Video className="h-3.5 w-3.5" /> Video Walkthrough
                      </a>
                    )}
                    {app.pptUrl && (
                      <a href={app.pptUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <ExternalLink className="h-3.5 w-3.5" /> Slide Deck
                      </a>
                    )}
                    {app.repoUrl && (
                      <a href={app.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <FileCode className="h-3.5 w-3.5" /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Registered Teams</h2>
          {loading ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-xs text-muted-foreground">
              Loading teams...
            </div>
          ) : teams.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Users className="mx-auto h-6 w-6 text-muted-foreground/50" />
              <p className="mt-2 text-xs text-muted-foreground">You are not part of any team yet.</p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/student/teams">Create a Team</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((t) => (
                <div key={t.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">{t.teamName}</h3>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {t.members?.length || 1} members
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.institutionName}</p>
                  {t.facultyMentorName && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Mentor: <span className="text-foreground">{t.facultyMentorName}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
