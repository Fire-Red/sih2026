"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { UserProfile, UserSession } from "@/types/auth";

interface CitizenDashboardProps {
  session: UserSession;
  profile: UserProfile | null;
}

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  district: string;
  endorsementCount: number;
  createdAt: string;
}

interface DashboardResponse {
  success?: boolean;
  data?: {
    reports: ReportItem[];
    counts: { total: number; active: number; resolved: number };
  };
}

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  fused_clustered: "Related found",
  validated: "Validated",
  assigned_to_hei: "Team assigned",
  solution_in_progress: "In progress",
  resolved_deployed: "Outcome recorded",
};

function getBadgeVariant(status: string): NonNullable<BadgeProps["variant"]> {
  switch (status) {
    case "submitted":
      return "secondary";
    case "under_review":
    case "assigned_to_hei":
    case "solution_in_progress":
      return "warning";
    case "resolved_deployed":
      return "success";
    case "validated":
    case "fused_clustered":
      return "default";
    default:
      return "outline";
  }
}

const journey = [
  {
    title: "Share your report",
    description: "Provide clear context and upload photo or document evidence.",
  },
  {
    title: "Intelligence clustering",
    description: "Related reports are correlated by domain, location, and timeframe.",
  },
  {
    title: "Official review",
    description: "Government officers evaluate and validate problem statements.",
  },
  {
    title: "Solution tracking",
    description: "Follow milestones and verifiable field impact outcomes.",
  },
];

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function CitizenDashboard({ session }: CitizenDashboardProps) {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const firstName = session.name.split(" ")[0] || "there";

  useEffect(() => {
    let active = true;
    const loadReports = async () => {
      try {
        const response = await fetch(`/api/dashboard/citizen?firebaseUid=${encodeURIComponent(session.id)}`);
        const data = (await response.json()) as DashboardResponse;
        if (active && data.success && data.data) {
          startTransition(() => setReports(data.data?.reports ?? []));
        }
      } catch {
        if (active) startTransition(() => setReports([]));
      } finally {
        if (active) startTransition(() => setLoading(false));
      }
    };
    void loadReports();
    return () => {
      active = false;
    };
  }, [session.id]);

  const visibleReports = useMemo(() => reports.slice(0, 5), [reports]);
  
  const stats = useMemo(() => {
    return {
      active: reports.filter((r) => r.status !== "resolved_deployed").length,
      submitted: reports.filter((r) => r.status === "submitted").length,
      underReview: reports.filter((r) => ["under_review", "assigned_to_hei", "solution_in_progress", "validated", "fused_clustered"].includes(r.status)).length,
      resolved: reports.filter((r) => r.status === "resolved_deployed").length,
    };
  }, [reports]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-6">
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-1">
            Citizen workspace
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Submit community issues and follow their verified resolution cycle.
          </p>
        </div>
        <Link href="/report">
          <Button size="default" className="gap-1.5 bg-neutral-900 text-white hover:bg-neutral-800">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Report issue
          </Button>
        </Link>
      </header>

      <section className="border-b border-neutral-200/80 pb-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-neutral-900">
              {loading ? "-" : stats.active}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Active reports
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-neutral-900">
              {loading ? "-" : stats.submitted}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Submitted
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-neutral-900">
              {loading ? "-" : stats.underReview}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Under review
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-neutral-900">
              {loading ? "-" : stats.resolved}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Resolved
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Recent submissions
          </h2>
          <Link
            href="/track"
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            View all
          </Link>
        </div>
        
        {loading ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            Loading recent reports...
          </div>
        ) : visibleReports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center">
            <p className="text-xs font-medium text-neutral-900">
              No reports submitted yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Submit your first report to start tracking community action.
            </p>
            <Link
              href="/report"
              className="mt-3 inline-block text-xs font-medium text-neutral-900 hover:underline"
            >
              Report a problem
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200/80 bg-white">
            {visibleReports.map((report) => (
              <Link
                key={report.id}
                href={`/track?submitted=${report.id}`}
                className="flex items-center justify-between p-3.5 transition-colors hover:bg-neutral-50"
              >
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-medium text-neutral-900 truncate">
                    {report.title}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {report.district || "General location"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={getBadgeVariant(report.status)}>
                    {statusLabels[report.status] ?? report.status}
                  </Badge>
                  <span className="text-[11px] text-neutral-400">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900">
          How problem resolution works
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-neutral-200/80 bg-white p-4"
            >
              <span className="text-xs font-mono text-neutral-400">
                0{index + 1}
              </span>
              <h3 className="mt-2 text-xs font-medium text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
