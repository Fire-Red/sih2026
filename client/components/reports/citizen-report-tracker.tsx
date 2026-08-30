"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Droplets,
  Sprout,
  Truck,
  HeartPulse,
  GraduationCap,
  Trees,
  Zap,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Filter,
  Plus,
  Loader2,
  ExternalLink,
  Building2,
  Users,
} from "lucide-react";
import { LOCAL_DISTRICTS } from "@/lib/constants/report-categories";

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  severity: "low" | "medium" | "high" | "critical";
  affectedPopulationEstimate: number;
  district: string;
  blockOrPanchayat: string | null;
  formattedAddress: string | null;
  status: string;
  endorsementCount: number;
  assignedInstitutionName: string | null;
  assignedProjectTitle: string | null;
  createdAt: string;
}

async function fetchReportItems(
  selectedDistrict: string,
  selectedCategory: string
): Promise<ReportItem[]> {
  let url = "/api/reports";
  const params = new URLSearchParams();
  if (selectedDistrict !== "all") params.append("district", selectedDistrict);
  if (selectedCategory !== "all") params.append("category", selectedCategory);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data.success || !Array.isArray(data.reports)) {
    throw new Error("Failed to load reports");
  }
  return data.reports as ReportItem[];
}

export function CitizenReportTracker() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("submitted");

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [endorsingIds, setEndorsingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    void fetchReportItems(selectedDistrict, selectedCategory)
      .then((nextReports) => {
        if (active) setReports(nextReports);
      })
      .catch((err: unknown) => {
        console.error("Error loading reports:", err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedDistrict]);

  const handleEndorse = async (id: string) => {
    if (endorsingIds[id]) return;
    setEndorsingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/reports/${id}/endorse`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, endorsementCount: data.endorsementCount } : r
          )
        );
      }
    } catch (err) {
      console.error("Error endorsing:", err);
    } finally {
      setEndorsingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> 1. Intake Submitted
          </span>
        );
      case "fused_clustered":
        return (
          <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-primary text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> 2. AI Clustered
          </span>
        );
      case "validated":
        return (
          <span className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> 3. Govt Validated
          </span>
        );
      case "assigned_to_hei":
      case "solution_in_progress":
        return (
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> 4. University R&D Active
          </span>
        );
      case "resolved_deployed":
        return (
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> 5. Solution Deployed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-surface-soft border border-hairline text-body text-xs font-semibold rounded-full">
            {status}
          </span>
        );
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "water_sanitation":
        return <Droplets className="w-4 h-4 text-primary" />;
      case "agriculture_irrigation":
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case "rural_infrastructure":
        return <Truck className="w-4 h-4 text-amber-600" />;
      case "healthcare_nutrition":
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case "education_skills":
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case "environment_waste":
        return <Trees className="w-4 h-4 text-emerald-700" />;
      case "energy_power":
        return <Zap className="w-4 h-4 text-amber-500" />;
      default:
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-hairline">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-primary mb-1">
            Real-Time Citizen Intelligence Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-ink">
            Community Problem Live Tracker
          </h1>
          <p className="text-sm text-body mt-1">
            Track submitted community issues as they transition from raw signals to university capstone research and deployed field solutions.
          </p>
        </div>

        <Link
          href="/report"
          className="self-start md:self-auto px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-active flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> Submit New Problem
        </Link>
      </div>

      {highlightId && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-semibold">Challenge Successfully Submitted!</span> Your problem is now live in the triage queue and visible to district administrators and university research cells.
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-hairline rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-muted uppercase">
          <Filter className="w-4 h-4 text-primary" /> Filter Signals:
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3.5 py-1.5 rounded-full border border-hairline bg-surface-soft text-xs font-medium text-ink focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All 24 Districts</option>
            {LOCAL_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-1.5 rounded-full border border-hairline bg-surface-soft text-xs font-medium text-ink focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Thematic Sectors</option>
            <option value="water_sanitation">Water & Sanitation</option>
            <option value="agriculture_irrigation">Agriculture & Irrigation</option>
            <option value="rural_infrastructure">Rural Infrastructure</option>
            <option value="healthcare_nutrition">Healthcare & Nutrition</option>
            <option value="education_skills">Education & Skills</option>
            <option value="environment_waste">Environment & Waste</option>
            <option value="energy_power">Energy & Power</option>
            <option value="rural_livelihoods">Rural Livelihoods</option>
          </select>
        </div>
      </div>

      {/* Report Feed */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-muted gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-mono">Loading real-time signal stream...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-hairline rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-surface-soft rounded-full flex items-center justify-center mx-auto text-muted">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="text-lg font-normal text-ink">
            No societal challenges reported in this filter yet.
          </div>
          <p className="text-xs text-body max-w-md mx-auto">
            Be the first citizen or community representative to submit a challenge for this district and trigger academic R&D problem solving.
          </p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary-active"
          >
            Submit First Challenge
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`bg-white border rounded-3xl p-6 transition-all hover:border-hairline-strong shadow-xs ${
                highlightId === report.id
                  ? "border-primary ring-2 ring-primary/20 bg-primary/[0.01]"
                  : "border-hairline"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {getStatusBadge(report.status)}
                  <span className="px-2.5 py-1 bg-surface-soft border border-hairline text-ink text-xs font-mono rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted" /> {report.district}, JH
                  </span>
                  <span className="px-2.5 py-1 bg-surface-soft border border-hairline text-ink text-xs font-medium rounded-full flex items-center gap-1">
                    {getCategoryIcon(report.category)}
                    <span className="capitalize">
                      {report.category.replace("_", " ")}
                    </span>
                  </span>
                </div>

                <div className="text-xs font-mono text-muted">
                  {new Date(report.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              <h3 className="text-lg font-normal text-ink mb-2">
                {report.title}
              </h3>

              <p className="text-sm text-body line-clamp-3 mb-4">
                {report.description}
              </p>

              {/* Institutional Match Card (if assigned) */}
              {report.assignedInstitutionName && (
                <div className="mb-4 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      HEI
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-indigo-950">
                        Assigned Research Partner: {report.assignedInstitutionName}
                      </div>
                      {report.assignedProjectTitle && (
                        <div className="text-[11px] text-indigo-700">
                          Active Capstone: {report.assignedProjectTitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-white text-indigo-700 px-2 py-1 rounded-full border border-indigo-200 uppercase">
                    NEP 2020 Aligned
                  </span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-muted">
                  <span className="flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5" /> ~{report.affectedPopulationEstimate} affected
                  </span>
                  {report.blockOrPanchayat && (
                    <span className="truncate max-w-[200px]">
                      📍 {report.blockOrPanchayat}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEndorse(report.id)}
                    disabled={endorsingIds[report.id]}
                    className="px-3.5 py-1.5 bg-surface-soft hover:bg-surface-strong border border-hairline rounded-full font-semibold text-ink flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <ThumbsUp className="w-3 h-3 text-primary" />
                    <span>I am also affected ({report.endorsementCount})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
