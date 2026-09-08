import React from "react";
import { Check } from "lucide-react";

export function LandingProvenance() {
  return (
    <section className="bg-white py-20 px-6 border-b border-neutral-200/80">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium text-neutral-500 mb-1 text-center">Governance</p>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-8 text-center">Data integrity guarantees</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Check className="h-3 w-3" />
            </span>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Official institutional directories are strictly used for verified capabilities. No fabricated records.
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Check className="h-3 w-3" />
            </span>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Distance and clustering run deterministically using PostGIS spatial functions. No AI spatial estimation.
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Check className="h-3 w-3" />
            </span>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Problem commissioning strictly requires a human validation gate by authorized government officers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
