import { getSession } from "@/lib/auth/session";
import type { ReviewDetail, ReviewQueueItem } from "@/types/government-review";

interface SuccessQueueResponse {
  success: true;
  reviews: ReviewQueueItem[];
}

interface SuccessDetailResponse {
  success: true;
  problem: ReviewDetail["problem"];
  evidence: ReviewDetail["evidence"];
  applications: ReviewDetail["applications"];
  events: ReviewDetail["events"];
}

interface SuccessSelectionResponse {
  success: true;
  projectId: string;
  selectedApplicationId: string;
}

interface FailureResponse {
  success: false;
  error: string;
}

type ApiFailure = FailureResponse & { status: number };

async function request<T extends object>(path: string, init?: RequestInit): Promise<T> {
  const session = getSession();
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as T | FailureResponse;
  if (!response.ok || ("success" in payload && payload.success === false)) {
    const failure: ApiFailure = {
      ...(payload as FailureResponse),
      status: response.status,
    };
    throw failure;
  }
  return payload as T;
}

export async function getReviewQueue(): Promise<ReviewQueueItem[]> {
  const response = await request<SuccessQueueResponse>("/api/government/reviews");
  return response.reviews;
}

export async function getReviewDetail(problemId: string): Promise<ReviewDetail> {
  const response = await request<SuccessDetailResponse>(`/api/government/reviews/${problemId}`);
  return {
    problem: response.problem,
    evidence: response.evidence,
    applications: response.applications,
    events: response.events,
  };
}

export async function selectReviewWinner(
  problemId: string,
  applicationId: string,
  reviewNotes: string
): Promise<SuccessSelectionResponse> {
  return request<SuccessSelectionResponse>(`/api/government/reviews/${problemId}/select`, {
    method: "POST",
    body: JSON.stringify({ applicationId, reviewNotes: reviewNotes || undefined }),
  });
}
