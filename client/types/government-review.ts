export interface ReviewProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  district: string | null;
  blockOrPanchayat: string | null;
  status: string;
  maxTeamsAllowed: number;
  appliedTeamsCount: number;
  selectedTeamId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewQueueItem {
  problem: ReviewProblem;
  applicationCount: number;
  pendingApplicationCount: number;
  selectedTeamId: string | null;
}

export interface ReviewApplication {
  id: string;
  teamId: string;
  teamName: string;
  institutionName: string;
  members: Array<{ name: string; role: string; year: number }>;
  pitchSummary: string;
  videoUrl: string | null;
  pptUrl: string | null;
  repoUrl: string | null;
  status: "submitted" | "under_review" | "shortlisted" | "selected_winner" | "rejected";
  submittedAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

export interface ReviewEvidence {
  id: string;
  mediaType: string;
  mediaUrl: string;
  caption: string | null;
}

export interface ReviewEvent {
  id: string;
  action: "winner_selected";
  notes: string | null;
  createdAt: string;
}

export interface ReviewDetail {
  problem: ReviewProblem;
  evidence: ReviewEvidence[];
  applications: ReviewApplication[];
  events: ReviewEvent[];
}
