export type ProjectStatus = "active" | "prototype" | "pilot" | "deployment" | "completed" | "blocked";
export type MilestoneStatus = "pending" | "in_progress" | "completed" | "overdue";

export interface ProjectMilestone {
  id: string;
  title: string;
  status: MilestoneStatus;
  dueDate: string | null;
  notes?: string | null;
}

export interface ProjectDetail {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: ProjectStatus;
    milestones: ProjectMilestone[] | null;
    pilotEvidence: string[] | null;
    startDate: string;
    targetEndDate: string | null;
  };
  problem: { id: string; title: string; category: string; district: string | null };
  team: { id: string; teamName: string; institutionName: string };
  application: { pitchSummary: string; videoUrl: string | null } | null;
}
