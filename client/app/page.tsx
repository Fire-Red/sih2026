import React from "react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingProof } from "@/components/landing/landing-proof";
import { LandingPipeline } from "@/components/landing/landing-pipeline";
import { LandingBento } from "@/components/landing/landing-bento";
import { LandingRoles } from "@/components/landing/landing-roles";
import { LandingProvenance } from "@/components/landing/landing-provenance";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/15 selection:text-primary">
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <LandingProof />
        <LandingPipeline />
        <LandingBento />
        <LandingRoles />
        <LandingProvenance />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
