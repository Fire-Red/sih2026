import React from "react";

export function LandingProof() {
  return (
    <section className="bg-white border-y border-neutral-200/80 py-10">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
        <div className="flex flex-col items-center text-center">
          <span className="text-3xl font-semibold tracking-tight text-neutral-900 mb-1">100%</span>
          <span className="text-xs text-neutral-500 font-normal">Provenance verified</span>
        </div>
        <div className="flex flex-col items-center text-center pt-6 md:pt-0">
          <span className="text-3xl font-semibold tracking-tight text-neutral-900 mb-1">3 teams</span>
          <span className="text-xs text-neutral-500 font-normal">Max application quota</span>
        </div>
        <div className="flex flex-col items-center text-center pt-6 md:pt-0">
          <span className="text-3xl font-semibold tracking-tight text-neutral-900 mb-1">PostGIS</span>
          <span className="text-xs text-neutral-500 font-normal">Spatial distance engine</span>
        </div>
        <div className="flex flex-col items-center text-center pt-6 md:pt-0">
          <span className="text-3xl font-semibold tracking-tight text-neutral-900 mb-1">Hybrid AI</span>
          <span className="text-xs text-neutral-500 font-normal">Deterministic validation</span>
        </div>
      </div>
    </section>
  );
}
