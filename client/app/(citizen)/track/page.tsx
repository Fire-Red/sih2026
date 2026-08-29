import React, { Suspense } from "react";
import { CitizenReportTracker } from "@/components/reports/citizen-report-tracker";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Live community problem tracker • CivicPulse",
  description:
    "Track community problems as they move from report to review and field solution.",
};

export default function TrackPage() {
  return (
    <WorkspaceFrame>
        <Suspense
          fallback={
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          }
        >
          <CitizenReportTracker />
        </Suspense>
    </WorkspaceFrame>
  );
}
