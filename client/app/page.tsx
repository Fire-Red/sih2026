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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <LandingNav />
      <main className="flex-1 pt-14">
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
