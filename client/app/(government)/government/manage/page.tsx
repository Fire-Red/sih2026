import { GovernmentReviewConsole } from "@/components/government/government-review-console";
import { WorkspaceFrame } from "@/components/dashboard/workspace-frame";

export default function GovernmentManagePage() {
  return (
    <WorkspaceFrame>
      <GovernmentReviewConsole />
    </WorkspaceFrame>
  );
}
