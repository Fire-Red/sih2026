import React from "react";
import { CitizenReportWizard } from "@/components/reports/citizen-report-wizard";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";

export const metadata = {
  title: "Submit a community problem • CivicPulse",
  description:
    "Report a community problem in water, agriculture, infrastructure, healthcare, or education.",
};

export default function CitizenReportPage() {
  return (
    <WorkspaceFrame>
      <CitizenReportWizard />
    </WorkspaceFrame>
  );
}
