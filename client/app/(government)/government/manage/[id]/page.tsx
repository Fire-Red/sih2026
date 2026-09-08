"use client";

import { use } from "react";
import { GovernmentProblemDetail } from "@/components/government/government-problem-detail";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GovernmentProblemDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return (
    <WorkspaceFrame>
      <GovernmentProblemDetail problemId={id} />
    </WorkspaceFrame>
  );
}
