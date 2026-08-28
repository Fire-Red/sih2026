"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { UserSession } from "@/types/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  Landmark,
  Layers,
  MapPin,
  Plus,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push("/login");
    } else {
      setSessionState(s);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav session={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-soft">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-foreground">
              Welcome back, {session?.name?.split(" ")[0] || "Innovator"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Active role: <span className="text-foreground font-medium capitalize">{session?.role}</span> • Session verified via Firebase Auth
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary hover:bg-[#003ecc] text-white text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Submit Issue Signal</span>
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-surface-soft border border-border-soft hover:bg-background text-foreground text-xs font-medium transition-colors"
            >
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Real-time Status Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-soft border border-border-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active Problem Signals</span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-normal text-foreground mt-2">128</p>
            <p className="text-[11px] text-muted-foreground mt-1">Across 14 districts</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-soft border border-border-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Validated Systemic DNAs</span>
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-normal text-foreground mt-2">24</p>
            <p className="text-[11px] text-emerald-600 mt-1">4 challenges published</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-soft border border-border-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Registered Labs & Unis</span>
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-normal text-foreground mt-2">42</p>
            <p className="text-[11px] text-muted-foreground mt-1">AISHE verified directory</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-soft border border-border-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active Field Pilots</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-normal text-foreground mt-2">9</p>
            <p className="text-[11px] text-muted-foreground mt-1">IoT & Ground verified</p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border-soft space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <h2 className="text-base font-medium text-foreground">Recent High-Priority Problem Clusters</h2>
                </div>
                <span className="text-xs text-primary font-medium hover:underline cursor-pointer">View radar</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Groundwater Heavy Metal Contamination & Solar Filtration Need",
                    location: "Rupnagar / Anandpur Sahib Sub-basin",
                    signals: 18,
                    urgency: "High",
                    category: "Water Resources",
                  },
                  {
                    title: "Rural Agricultural Cold Storage & Off-Grid Perishable Logistics",
                    location: "Shimla Apple Belt / Theog District",
                    signals: 14,
                    urgency: "Medium",
                    category: "AgriTech / Logistics",
                  },
                  {
                    title: "Hill-Slope Landslide Early Warning & Vibration Telemetry",
                    location: "Kullu - Mandi Highway Corridor",
                    signals: 26,
                    urgency: "Critical",
                    category: "Disaster Management",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-surface-soft border border-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{item.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.urgency === "Critical"
                            ? "bg-red-100 text-red-700"
                            : item.urgency === "High"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </span>
                        <span>•</span>
                        <span>{item.signals} citizen signals fused</span>
                      </div>
                    </div>

                    <Link
                      href="/validate"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-[#003ecc] shrink-0"
                    >
                      <span>Examine DNA</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Side Column */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-surface-soft border border-border-soft space-y-4">
              <h2 className="text-sm font-medium text-foreground">Stakeholder Portals</h2>
              <div className="space-y-2">
                {[
                  { name: "Problem Validation Console", icon: <Landmark className="h-4 w-4" />, href: "/validate" },
                  { name: "Signal Reporting Wizard", icon: <FileText className="h-4 w-4" />, href: "/report" },
                  { name: "Capability Matching Engine", icon: <Building2 className="h-4 w-4" />, href: "/institution/capabilities" },
                  { name: "Student Innovation Challenges", icon: <GraduationCap className="h-4 w-4" />, href: "/student/dashboard" },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-background border border-border-soft hover:border-primary/40 text-xs font-medium text-foreground transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-primary">{link.icon}</span>
                      <span>{link.name}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-primary/20 bg-primary/5 space-y-2">
              <div className="flex items-center gap-2 text-primary text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Problem Fusion Engine</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Background Mistral Embeddings & PostGIS spatial clustering are active for All-India signal normalization.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
