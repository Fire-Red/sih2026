import React from "react";
import { Activity, ShieldCheck, MapPin, Database, CheckCircle2 } from "lucide-react";

export function LandingDNAShowcase() {
  return (
    <section id="telemetry" className="py-24 bg-surface-soft px-6 border-b border-border-soft">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-3">
            Real Telemetry Diagnostics
          </span>
          <h2 className="text-4xl sm:text-5xl font-normal tracking-[-0.03em] text-foreground">
            Transparent event data and signal breakdowns.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Every problem cluster generates an audit record tracking semantic vector similarity, spatial bounds, physical symptoms, and matched solvers.
          </p>
        </div>

        {/* Big White Card with 24px Pill Architecture */}
        <div className="rounded-3xl bg-card border border-border-soft p-8 sm:p-10 shadow-xs space-y-8">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-soft">
            <div>
              <span className="text-xs font-mono text-muted-foreground uppercase">
                EVENT TELEMETRY · #JH-2026-084
              </span>
              <h3 className="text-2xl font-medium text-foreground mt-1">
                Dumka Sub-basin Water Infrastructure & Arsenic Anomaly
              </h3>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#defbe6] text-semantic-up text-xs font-mono font-medium">
              Verified by Municipal Directorate
            </span>
          </div>

          {/* 3 Large Telemetry Metric Blocks */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface-soft border border-border-soft">
              <span className="text-xs font-mono uppercase text-muted-foreground block mb-2">
                Semantic Cosine Similarity
              </span>
              <span className="text-3xl font-mono text-foreground font-normal">
                91.2%
              </span>
              <p className="text-xs text-muted-foreground mt-2">
                Mistral 1024-dim embeddings matched across 14 citizen submissions
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-soft border border-border-soft">
              <span className="text-xs font-mono uppercase text-muted-foreground block mb-2">
                Geospatial Cohesion
              </span>
              <span className="text-3xl font-mono text-foreground font-normal">
                87.4%
              </span>
              <p className="text-xs text-muted-foreground mt-2">
                PostGIS ST_DWithin clustering across 3 adjacent municipal wards
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-soft border border-border-soft">
              <span className="text-xs font-mono uppercase text-muted-foreground block mb-2">
                Temporal Density Window
              </span>
              <span className="text-3xl font-mono text-foreground font-normal">
                79.0%
              </span>
              <p className="text-xs text-muted-foreground mt-2">
                14 incidents recorded over a consecutive 8-day rolling period
              </p>
            </div>
          </div>

          {/* Decomposed Evidence and Solver Consortia */}
          <div className="grid lg:grid-cols-2 gap-8 pt-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
                Detected Physical Symptoms & Root Causes
              </h4>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold">·</span>
                  <span>Severe pressure deficits across municipal trunk lines during morning hours</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold">·</span>
                  <span>Periodic heavy particulate readings reported in ward 4 and ward 7</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold">·</span>
                  <span>Unreinforced ductile iron mains exceeding 15-year operational lifecycle</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
                Assigned Multidisciplinary Consortia
              </h4>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-surface-soft border border-border-soft flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-foreground text-sm block">BIT Mesra</span>
                    <span className="text-muted-foreground font-mono text-[11px]">Hydraulic Modeling Lab</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono font-medium">
                    Lead Solver (94% Fit)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-soft border border-border-soft flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-foreground text-sm block">IIT ISM Dhanbad</span>
                    <span className="text-muted-foreground font-mono text-[11px]">Applied Geochemistry & IoT Sensing</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono font-medium">
                    IoT Partner (88% Fit)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Provenance Stamp */}
          <div className="pt-6 border-t border-border-soft flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-semantic-up" />
              <span>Evidence Trail: 14 citizen submissions · 8 geotagged photos · 2 official municipal log files</span>
            </div>
            <span>Provenance: UGC Academic Directory & State Spatial Bounds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
