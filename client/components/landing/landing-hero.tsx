import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="pt-20 pb-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.035em] text-foreground leading-[1.08]">
          Connecting societal problems to verified university and industry solvers.
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed">
          A structured civic platform that clusters citizen reported issues, decomposes the required technical capabilities, and matches multidisciplinary teams to build and verify solutions.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/report">
            <Button className="h-12 px-7 rounded-full bg-primary text-primary-foreground hover:bg-[#003ecc] font-medium text-sm shadow-xs">
              <span>Submit a community report</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/validate">
            <Button
              variant="outline"
              className="h-12 px-7 rounded-full bg-surface-soft border-border-soft text-foreground hover:bg-surface-strong font-medium text-sm"
            >
              <span>Government console</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
