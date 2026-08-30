import React from "react";
import { CitizenReportWizard } from "@/components/reports/citizen-report-wizard";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
  title: "Submit a community problem • CivicPulse",
  description:
    "Report a community problem in water, agriculture, infrastructure, healthcare, or education.",
};

export default function CitizenReportPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <LandingNav />
      <main className="flex-1 pt-14">
        <CitizenReportWizard />
      </main>
      <LandingFooter />
    </div>
  );
}
