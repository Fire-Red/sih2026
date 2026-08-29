import React from "react";
import { ShieldCheck, Network, Cpu, Database, CheckCircle2 } from "lucide-react";

export function LandingProof() {
  return (
    <section className="py-12 bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="pt-4 md:pt-0 px-4">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground tnum">100%</div>
            <div className="text-xs font-medium text-muted-foreground mt-1">Provenance Verification</div>
          </div>
          <div className="pt-4 md:pt-0 px-4">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-primary tnum">3 Teams</div>
            <div className="text-xs font-medium text-muted-foreground mt-1">Max Quota per Challenge</div>
          </div>
          <div className="pt-4 md:pt-0 px-4">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground tnum">PostGIS</div>
            <div className="text-xs font-medium text-muted-foreground mt-1">Deterministic Proximity</div>
          </div>
          <div className="pt-4 md:pt-0 px-4">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground tnum">AI Hybrid</div>
            <div className="text-xs font-medium text-muted-foreground mt-1">Multi Signal Clustering</div>
          </div>
        </div>
      </div>
    </section>
  );
}
