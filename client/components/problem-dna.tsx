import * as React from "react";
import { cn } from "@/lib/utils";

interface ProblemDNAProps {
  title: string;
  location: string;
  status?: string;
  reportsCount: number;
  locationsCount: number;
  domain: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  trend: string;
  geographicSpread: string;
  symptoms: string[];
  causes: string[];
  capabilities: { name: string; level: number; priority: "essential" | "important" | "nice to have" }[];
  evidence: { reports: number; photos: number; documents: number; sources: number };
  sourceName: string;
  verifiedDate: string;
  className?: string;
}

export function ProblemDNA({
  title,
  location,
  status = "VALIDATED",
  reportsCount,
  locationsCount,
  domain,
  severity,
  trend,
  geographicSpread,
  symptoms,
  causes,
  capabilities,
  evidence,
  sourceName,
  verifiedDate,
  className,
}: ProblemDNAProps) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-border bg-card text-card-foreground p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] divide-y divide-border",
        className
      )}
    >
      {/* Header section */}
      <div className="pb-6">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
            PROBLEM DNA SPECIFICATION
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#defbe6] text-[#24a148] border border-[#24a148]/20">
            ✓ {status}
          </span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight uppercase text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {location} · <span className="font-mono text-foreground font-medium">{reportsCount}</span> related reports ·{" "}
          <span className="font-mono text-foreground font-medium">{locationsCount}</span> affected locations
        </p>
      </div>

      {/* Domain & Metrics Grid */}
      <div className="py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <span className="text-xs font-mono uppercase text-muted-foreground block mb-1">DOMAIN</span>
          <span className="text-sm font-medium text-foreground">{domain}</span>
        </div>
        <div>
          <span className="text-xs font-mono uppercase text-muted-foreground block mb-1">SEVERITY</span>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-muted rounded-[2px] overflow-hidden flex">
              <div
                className={cn(
                  "h-full rounded-[2px]",
                  severity === "Critical" ? "w-full bg-[#da1e28]" : "w-3/4 bg-[#f1c21b]"
                )}
              />
            </div>
            <span className="text-xs font-mono font-medium text-foreground">{severity}</span>
          </div>
        </div>
        <div>
          <span className="text-xs font-mono uppercase text-muted-foreground block mb-1">TREND</span>
          <span className="text-sm font-medium text-foreground">{trend}</span>
        </div>
        <div>
          <span className="text-xs font-mono uppercase text-muted-foreground block mb-1">GEOGRAPHIC SPREAD</span>
          <span className="text-sm font-mono text-foreground">{geographicSpread}</span>
        </div>
      </div>

      {/* Symptoms and Causes */}
      <div className="py-6 grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-mono uppercase text-muted-foreground mb-3">SYMPTOMS</h4>
          <ul className="space-y-2">
            {symptoms.map((symptom, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-muted-foreground select-none">·</span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-mono uppercase text-muted-foreground mb-3">POSSIBLE CAUSES</h4>
          <ul className="space-y-2">
            {causes.map((cause, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-muted-foreground select-none">·</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Required Capabilities Breakdown */}
      <div className="py-6">
        <h4 className="text-xs font-mono uppercase text-muted-foreground mb-4">REQUIRED CAPABILITIES</h4>
        <div className="space-y-3.5">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="flex items-center gap-4 text-sm">
              <span className="w-44 font-medium text-foreground truncate">{cap.name}</span>
              <div className="flex-1 h-2 bg-muted rounded-[4px] overflow-hidden">
                <div
                  className="h-full bg-primary rounded-[4px] transition-all"
                  style={{ width: `${cap.level}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-[4px] font-mono",
                  cap.priority === "essential"
                    ? "bg-[#F0EDFE] text-primary"
                    : cap.priority === "important"
                    ? "bg-muted text-muted-foreground"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                {cap.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence & Provenance footer */}
      <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-muted-foreground">
        <div>
          <span className="font-mono uppercase block text-muted-foreground mb-1">EVIDENCE AUDIT</span>
          <span className="text-foreground font-mono">
            {evidence.reports} reports · {evidence.photos} photos · {evidence.documents} documents · {evidence.sources} sources
          </span>
        </div>
        <div className="text-left md:text-right">
          <span className="font-mono uppercase block text-muted-foreground mb-1">PROVENANCE</span>
          <span>
            Source: <strong className="text-foreground">{sourceName}</strong> · Verified:{" "}
            <span className="font-mono text-foreground">{verifiedDate}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
