import React from "react";
import Link from "next/link";
import { Database, MapPin, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const guarantees = [
  {
    icon: Database,
    title: "Official institutional directories",
    description:
      "University capabilities are sourced from accredited higher education directories and verified department pages. No fabricated records.",
  },
  {
    icon: MapPin,
    title: "Geospatial calculations",
    description:
      "Distance and clustering run deterministically using PostGIS spatial functions. The system never uses AI to estimate geographic proximity.",
  },
  {
    icon: UserCheck,
    title: "Human validation gate",
    description:
      "Problem profiles and challenge commissionings require explicit review and approval by authorized government officers before any action.",
  },
];

export function LandingProvenance() {
  return (
    <section id="data-model" className="py-20 bg-muted px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-12">
          <h2 className="text-3xl sm:text-[32px] font-light tracking-[-0.03em] text-foreground">
            Data integrity and provenance
          </h2>
          <p className="mt-3 text-base text-muted-foreground font-light leading-relaxed">
            Every record in the system tracks its origin, verification date, and current status.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-6 rounded-xl bg-card border border-border">
                <Icon className="h-5 w-5 text-muted-foreground mb-4" />
                <h3 className="text-[15px] font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-[15px] font-medium text-foreground">
              Ready to submit a problem or apply as a team?
            </h4>
            <p className="text-sm text-muted-foreground mt-1 font-light">
              Open the reporting form or browse published problems to apply with your team.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/problems">
              <Button className="rounded-full px-5 h-10 text-xs font-medium gap-1.5">
                Browse problems
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/report">
              <Button
                variant="secondary"
                className="rounded-full px-5 h-10 text-xs font-medium border border-border"
              >
                Report an issue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

