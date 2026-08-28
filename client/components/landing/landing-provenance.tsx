import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingProvenance() {
  return (
    <section id="data-model" className="py-20 bg-surface-soft px-6 border-b border-border-soft">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-foreground">
            Data integrity & provenance
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Every record in the system tracks its origin, verification date, and status.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border-soft">
            <h3 className="text-base font-medium text-foreground">
              Official institutional directories
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              University capabilities are sourced from accredited higher education directories and verified department pages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border-soft">
            <h3 className="text-base font-medium text-foreground">
              Geospatial calculations
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Distance and clustering computations run deterministically using PostGIS spatial functions rather than opaque estimates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border-soft">
            <h3 className="text-base font-medium text-foreground">
              Human validation gate
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Problem profiles and challenge commissionings require explicit review and approval by authorized officers.
            </p>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-card border border-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-medium text-foreground">
              Ready to submit or review community problems?
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Access the reporting form or log in to the administrative console.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/report"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-[#003ecc] transition-all shadow-xs"
            >
              Report an issue
            </Link>
            <Link
              href="/validate"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-surface-soft border border-border-soft text-foreground text-xs font-medium hover:bg-surface-strong transition-all"
            >
              Open console
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
