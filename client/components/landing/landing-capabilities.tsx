import React from "react";
import { Building2, ArrowUpRight, MapPin } from "lucide-react";

const institutions = [
  {
    name: "Regional engineering institute",
    location: "North district",
    capabilities: ["Hydraulic Network Modeling", "Embedded Telemetry", "Water Desalination & Filtration"],
    labs: "Department of Civil & Environmental Engineering",
    fit: "94.2% Capability Match",
  },
  {
    name: "Applied science institute",
    location: "Central district",
    capabilities: ["Hydrogeology Sensing", "Heavy Metal Assay", "Groundwater Telemetry"],
    labs: "Centre of Excellence in Mining & Environment",
    fit: "88.6% Capability Match",
  },
  {
    name: "Technology institute",
    location: "Eastern district",
    capabilities: ["Sensor Fabrication", "Embedded Systems", "Cold-Chain Telemetry"],
    labs: "Micro-electronics & Sensor Fabrication Lab",
    fit: "82.0% Capability Match",
  },
];

export function LandingCapabilities() {
  return (
    <section id="institutions" className="py-24 bg-background px-6 border-b border-border-soft">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-3">
            Academic Capability Graph
          </span>
          <h2 className="text-4xl sm:text-5xl font-normal tracking-[-0.03em] text-foreground">
            Connecting problems to accredited research laboratories.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Every capability record is audited against official university department pages and government registries.
          </p>
        </div>

        {/* Institution Grid with 24px Pill Geometry */}
        <div className="grid md:grid-cols-3 gap-8">
          {institutions.map((inst, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card border border-border-soft hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {inst.location}
                  </span>
                  <span className="text-foreground font-semibold">{inst.fit}</span>
                </div>

                <h3 className="text-xl font-medium text-foreground">
                  {inst.name}
                </h3>
                <span className="text-xs font-mono text-muted-foreground block mt-1.5">
                  {inst.labs}
                </span>

                <div className="mt-8 space-y-2">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {inst.capabilities.map((cap, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-3 py-1 rounded-full text-xs bg-surface-soft border border-border-soft text-foreground font-medium"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border-soft flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Accreditation: UGC / NIRF</span>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
