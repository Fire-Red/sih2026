"use client";

import React, { useState } from "react";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";
import { ProblemCard, Problem } from "@/components/problems/problem-card";
import { ApplicationDrawer } from "@/components/problems/application-drawer";
import { LOCAL_DISTRICTS } from "@/lib/constants/report-categories";
import { Layers3, Filter, Search } from "lucide-react";

const SEED_PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Groundwater contamination and high fluoride concentration in village tube wells",
    district: "Central district",
    category: "Water & Sanitation",
    severity: "critical",
    reportCount: 14,
    maxTeams: 3,
    appliedTeams: 2,
    sponsoringDept: "Drinking Water and Sanitation Department",
    summary: "Excessive fluoride concentration (>1.5 mg/L) detected across multiple bore wells, causing dental and skeletal fluorosis in school children.",
  },
  {
    id: "p2",
    title: "Post harvest storage deficit and cold chain spoilage for perishable produce",
    district: "East district",
    category: "Agriculture & Irrigation",
    severity: "high",
    reportCount: 9,
    maxTeams: 3,
    appliedTeams: 1,
    sponsoringDept: "Department of Agriculture",
    summary: "Lack of localized micro cold storage results in 35% tomato and seasonal vegetable spoilage before reaching weekly regional markets.",
  },
  {
    id: "p3",
    title: "Washed out bridge culvert cutting off primary healthcare transit during monsoons",
    district: "Hill district",
    category: "Rural Infrastructure",
    severity: "high",
    reportCount: 8,
    maxTeams: 3,
    appliedTeams: 3,
    sponsoringDept: "Rural Development Department",
    summary: "Seasonal stream swelling washes out unreinforced culvert, isolating 4 panchayats from emergency ambulance routes for 3 months each year.",
  },
  {
    id: "p4",
    title: "Defunct solar mini-grid battery bank failure in tribal hamlet cluster",
    district: "Valley district",
    category: "Energy & Power",
    severity: "medium",
    reportCount: 5,
    maxTeams: 3,
    appliedTeams: 0,
    sponsoringDept: "Renewable Energy Development Agency",
    summary: "Lead-acid battery degradation left 45 households without reliable lighting and micro-irrigation power for over 6 months.",
  },
];

export default function ProblemsPage() {
  const [problems] = useState<Problem[]>(SEED_PROBLEMS);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  const filtered = problems.filter((p) => {
    if (selectedDistrict !== "all" && p.district !== selectedDistrict) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <WorkspaceFrame>
      <div className="mx-auto max-w-5xl px-4 pb-16 text-foreground sm:px-0">
        <header className="border-b border-border pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-2">
            <Layers3 className="h-4 w-4" /> Open Problem Statements
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Validated Community Challenges
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl font-light leading-relaxed">
            Public directory of government validated systemic problems. Student and research teams can propose field solutions within allocated team quotas.
          </p>
        </header>

        {/* Filter Bar */}
        <section className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search problems, keywords, or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Districts</option>
              {LOCAL_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Sectors</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Agriculture & Irrigation">Agriculture & Irrigation</option>
              <option value="Rural Infrastructure">Rural Infrastructure</option>
              <option value="Energy & Power">Energy & Power</option>
            </select>
          </div>
        </section>

        {/* Problem List */}
        <section className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              <p className="text-sm">No problem statements match the selected criteria.</p>
            </div>
          ) : (
            filtered.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onApply={(p) => setActiveProblem(p)}
              />
            ))
          )}
        </section>

        <ApplicationDrawer
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
        />
      </div>
    </WorkspaceFrame>
  );
}
