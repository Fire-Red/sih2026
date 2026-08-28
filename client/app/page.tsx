import React from "react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPipeline } from "@/components/landing/landing-pipeline";
import { LandingRoles } from "@/components/landing/landing-roles";
import { LandingProvenance } from "@/components/landing/landing-provenance";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/15 selection:text-primary">
      {/* Navigation */}
      <LandingNav />

      {/* Main Content */}
      <main className="flex-1">
        {/* Clean Hero Briefing */}
        <LandingHero />

        {/* 4-Step Structured Workflow */}
        <LandingPipeline />

        {/* Stakeholder Portals */}
        <LandingRoles />

        {/* Data Integrity & Provenance Guarantee */}
        <LandingProvenance />
      </main>

      {/* Minimal Footer */}
      <LandingFooter />
    </div>
  );
}
