export interface ReviewProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  district: string | null;
  blockOrPanchayat: string | null;
  latitude?: string | null;
  longitude?: string | null;
  status: string;
  maxTeamsAllowed: number;
  appliedTeamsCount: number;
  selectedTeamId: string | null;
  sponsoringDepartment?: string | null;
  grantAmount?: string | null;
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
  action: "winner_selected" | "status_updated" | "problem_published";
  notes: string | null;
  createdAt: string;
}

export interface SimilarReportMatch {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string | null;
  blockOrPanchayat: string | null;
  severity: string;
  status: string;
  similarity: number;
  distanceKm: number | null;
}

export interface ReviewDetail {
  problem: ReviewProblem;
  evidence: ReviewEvidence[];
  applications: ReviewApplication[];
  events: ReviewEvent[];
}
