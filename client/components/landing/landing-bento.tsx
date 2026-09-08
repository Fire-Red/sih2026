import React from "react";
import { Layers, Cpu, MapPin, Database } from "lucide-react";

export function LandingBento() {
  return (
    <section className="bg-white py-20 px-6 border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium text-neutral-500 mb-1">Architecture</p>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-10">Platform foundation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5">
            <Layers className="h-4 w-4 text-neutral-900 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Multi-signal fusion</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Combines semantic embeddings with geographic proximity and temporal correlation to group reports into systemic issues.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5">
            <Cpu className="h-4 w-4 text-neutral-900 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Capability assembly</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Deconstructs problems into concrete engineering capabilities to match verified university laboratories.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5">
            <MapPin className="h-4 w-4 text-neutral-900 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Deterministic PostGIS</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Zero distance hallucinations. Spatial radius calculations execute deterministically via PostgreSQL PostGIS geometry.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5">
            <Database className="h-4 w-4 text-neutral-900 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Solution memory</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Successful field pilot outcomes are permanently stored in vector memory for instant reuse across districts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
