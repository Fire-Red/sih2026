"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Filter, Loader2, Search } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { REPORT_CATEGORIES } from "@/lib/constants/report-categories";

import { getSession } from "@/lib/auth/session";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  district: string | null;
  status: string;
  endorsementCount: number;
  appliedTeamsCount: number;
  maxTeamsAllowed: number;
  updatedAt: string;
}

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  fused_clustered: "Clustering",
  validated: "Validated",
  assigned_to_hei: "Assigned",
  solution_in_progress: "In progress",
  resolved_deployed: "Resolved",
  rejected: "Closed",
};

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  submitted: "secondary",
  under_review: "warning",
  fused_clustered: "default",
  validated: "success",
  assigned_to_hei: "default",
  solution_in_progress: "default",
  resolved_deployed: "success",
  rejected: "destructive",
};

const categoryName = (value: string) =>
  REPORT_CATEGORIES.find((item) => item.id === value)?.name ??
  value.replaceAll("_", " ");

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const session = getSession();
    void fetch("/api/problems", {
      headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          success?: boolean;
          problems?: Problem[];
          error?: string;
        };
        if (!response.ok || !data.success || !data.problems) {
          throw new Error(data.error ?? "Unable to load problems.");
        }
        if (active) setProblems(data.problems);
      })
      .catch((loadError: unknown) => {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load problems."
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredProblems = useMemo(
    () =>
      problems.filter((problem) => {
        const searchable =
          `${problem.title} ${problem.description} ${problem.district ?? ""}`.toLowerCase();
        return (
          (!query.trim() || searchable.includes(query.toLowerCase())) &&
          (category === "all" || problem.category === category) &&
          (status === "all" || problem.status === status)
        );
      }),
    [category, problems, query, status]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <LandingNav />
      <main className="flex-1 pt-14">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-10">
          <header className="pb-6 border-b border-neutral-200/80">
            <p className="text-xs font-medium text-neutral-500 mb-1">
              Open directory
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Problem statements
            </h1>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Browse verified community issues open for research, proposals, and student team applications.
            </p>
          </header>

          <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search problems by keyword or location..."
                className="pl-9 h-9 text-xs rounded-lg border-neutral-200"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-9 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs text-neutral-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
              >
                <option value="all">All categories</option>
                {REPORT_CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-9 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs text-neutral-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
              >
                <option value="all">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-2 py-16 text-xs text-neutral-400 justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
              Loading problems...
            </div>
          )}

          {!loading && error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
              <p>{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2 h-7 text-xs"
              >
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && filteredProblems.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-neutral-200 p-12 text-center">
              <Filter className="mx-auto h-5 w-5 text-neutral-400" />
              <h2 className="mt-3 text-xs font-medium text-neutral-900">
                No matching problems
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Try adjusting search terms or filters.
              </p>
              <Link href="/report" className="mt-4 inline-block">
                <Button type="button" size="sm" className="bg-neutral-900 text-white">
                  Report issue
                </Button>
              </Link>
            </div>
          )}

          {!loading && !error && filteredProblems.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-neutral-500 pb-1">
                <span>{filteredProblems.length} problems found</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                      <th className="py-2.5 px-4 font-medium text-neutral-500">
                        Problem statement
                      </th>
                      <th className="py-2.5 px-4 font-medium text-neutral-500">
                        Category
                      </th>
                      <th className="hidden py-2.5 px-4 font-medium text-neutral-500 md:table-cell">
                        District
                      </th>
                      <th className="py-2.5 px-4 font-medium text-neutral-500">
                        Status
                      </th>
                      <th className="hidden py-2.5 px-4 font-medium text-neutral-500 lg:table-cell">
                        Team quota
                      </th>
                      <th className="hidden py-2.5 px-4 font-medium text-neutral-500 lg:table-cell">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProblems.map((problem) => (
                      <tr
                        key={problem.id}
                        className="hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 max-w-xs lg:max-w-md">
                          <Link
                            href={`/problems/${problem.id}`}
                            className="block font-medium text-neutral-900 hover:underline truncate"
                          >
                            {problem.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-neutral-600 whitespace-nowrap">
                          {categoryName(problem.category)}
                        </td>
                        <td className="hidden py-3 px-4 text-neutral-600 md:table-cell">
                          {problem.district || "General"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={statusVariant[problem.status] ?? "secondary"}>
                            {statusLabels[problem.status] ?? problem.status}
                          </Badge>
                        </td>
                        <td className="hidden py-3 px-4 text-neutral-600 lg:table-cell">
                          {problem.appliedTeamsCount} / {problem.maxTeamsAllowed}
                        </td>
                        <td className="hidden py-3 px-4 text-neutral-400 lg:table-cell whitespace-nowrap">
                          {new Date(problem.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
