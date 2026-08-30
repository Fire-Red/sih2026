import { getValidAuthToken } from "@/lib/auth/session";
import type { ReviewDetail, ReviewProblem, ReviewQueueItem, SimilarReportMatch, SimilarityAlert } from "@/types/government-review";
import {
  failureResponseSchema,
  reviewProblemSchema,
  successDetailResponseSchema,
  successQueueResponseSchema,
  successSelectionResponseSchema,
  successSimilarResponseSchema,
} from "./schemas/government-review-schemas";
import { z } from "zod";

interface FailureResponse {
  success: false;
  error: string;
}

type ApiFailure = FailureResponse & { status: number };

async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const token = await getValidAuthToken();
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const rawPayload = await response.json();
  const failureParsed = failureResponseSchema.safeParse(rawPayload);
  if (!response.ok || failureParsed.success) {
    const failure: ApiFailure = {
      success: false,
      error: failureParsed.success ? failureParsed.data.error : "Request failed.",
      status: response.status,
    };
    throw failure;
  }
  const parsed = schema.safeParse(rawPayload);
  if (!parsed.success) {
    throw {
      success: false,
      error: "Unexpected response format from review service.",
      status: response.status,
    } as ApiFailure;
  }
  return parsed.data;
}

export async function getReviewQueue(): Promise<ReviewQueueItem[]> {
  const response = await request("/api/government/reviews", successQueueResponseSchema);
  return response.reviews;
}

export async function getSimilarityAlerts(): Promise<SimilarityAlert[]> {
  const response = await request("/api/government/similar-alerts", z.object({ success: z.literal(true), alerts: z.array(z.object({
    relationship: z.object({
      reportId: z.string(), relatedReportId: z.string(), semanticSimilarity: z.string(), geographicDistanceKm: z.string().nullable(), relationshipType: z.string(), confidenceLevel: z.string(), createdAt: z.string(),
    }),
    relatedReport: z.object({ id: z.string(), title: z.string(), district: z.string().nullable(), createdAt: z.string() }),
  })) }));
  return response.alerts as SimilarityAlert[];
}

export async function getReviewDetail(problemId: string): Promise<ReviewDetail> {
  const response = await request(`/api/government/reviews/${problemId}`, successDetailResponseSchema);
  return {
    problem: response.problem,
    evidence: response.evidence,
    applications: response.applications,
    events: response.events,
  };
}

export async function updateReportStatus(
  problemId: string,
  status: "submitted" | "under_review" | "validated" | "rejected"
): Promise<{ success: true; problem: ReviewProblem }> {
  return request(
    "/api/government/status",
    z.object({ success: z.literal(true), problem: reviewProblemSchema }),
    {
      method: "PATCH",
      body: JSON.stringify({ problemId, status }),
    }
  );
}

export async function getSimilarReports(
  reportId: string,
  text: string,
  category?: string,
  latitude?: string | null,
  longitude?: string | null
): Promise<SimilarReportMatch[]> {
  const response = await request("/api/government/similar", successSimilarResponseSchema, {
    method: "POST",
    body: JSON.stringify({
      reportId,
      text,
      category,
      latitude,
      longitude,
    }),
  });
  return response.results;
}

export async function publishProblemStatement(payload: {
  problemId: string;
  mergedReportIds?: string[];
  title: string;
  description: string;
  maxTeamsAllowed?: number;
  sponsoringDepartment?: string;
  grantAmount?: string;
}): Promise<{ success: true; problem: ReviewProblem }> {
  return request(
    "/api/government/publish",
    z.object({ success: z.literal(true), problem: reviewProblemSchema }),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function selectReviewWinner(
  problemId: string,
  applicationId: string,
  reviewNotes: string
): Promise<{ success: true; projectId: string; selectedApplicationId: string }> {
  return request(`/api/government/reviews/${problemId}/select`, successSelectionResponseSchema, {
    method: "POST",
    body: JSON.stringify({ applicationId, reviewNotes: reviewNotes || undefined }),
  });
}

export async function updateSimilarReviewMode(
  problemId: string,
  mode: "manual_review" | "queue_high_confidence"
): Promise<void> {
  const response = await request(
    "/api/government/review-mode",
    z.object({ success: z.literal(true), problem: z.object({ id: z.string(), similarReviewMode: z.enum(["manual_review", "queue_high_confidence"]) }) }),
    { method: "PATCH", body: JSON.stringify({ problemId, mode }) }
  );
  void response;
}
