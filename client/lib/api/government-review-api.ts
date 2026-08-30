import { getSession } from "@/lib/auth/session";
import type { ReviewDetail, ReviewQueueItem } from "@/types/government-review";
import {
  failureResponseSchema,
  successDetailResponseSchema,
  successQueueResponseSchema,
  successSelectionResponseSchema,
} from "./schemas/government-review-schemas";
import { z } from "zod";

interface FailureResponse {
  success: false;
  error: string;
}

type ApiFailure = FailureResponse & { status: number };

async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const session = getSession();
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
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

export async function getReviewDetail(problemId: string): Promise<ReviewDetail> {
  const response = await request(`/api/government/reviews/${problemId}`, successDetailResponseSchema);
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
): Promise<{ success: true; projectId: string; selectedApplicationId: string }> {
  return request(`/api/government/reviews/${problemId}/select`, successSelectionResponseSchema, {
    method: "POST",
    body: JSON.stringify({ applicationId, reviewNotes: reviewNotes || undefined }),
  });
}

