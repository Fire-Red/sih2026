import { z } from "zod";

export const reviewProblemIdSchema = z.object({
  problemId: z.string().uuid(),
});

export const selectWinnerSchema = z.object({
  applicationId: z.string().uuid(),
  reviewNotes: z.string().trim().max(2000).optional(),
});

export type SelectWinnerInput = z.infer<typeof selectWinnerSchema>;

export const reviewProblemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  severity: z.string(),
  district: z.string().nullable(),
  blockOrPanchayat: z.string().nullable(),
  status: z.string(),
  maxTeamsAllowed: z.number(),
  appliedTeamsCount: z.number(),
  selectedTeamId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const reviewQueueItemSchema = z.object({
  problem: reviewProblemSchema,
  applicationCount: z.number(),
  pendingApplicationCount: z.number(),
  selectedTeamId: z.string().nullable(),
});

export const reviewApplicationSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  teamName: z.string(),
  institutionName: z.string(),
  members: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      year: z.number(),
    })
  ),
  pitchSummary: z.string(),
  videoUrl: z.string().nullable(),
  pptUrl: z.string().nullable(),
  repoUrl: z.string().nullable(),
  status: z.enum(["submitted", "under_review", "shortlisted", "selected_winner", "rejected"]),
  submittedAt: z.string(),
  reviewedAt: z.string().nullable(),
  reviewNotes: z.string().nullable(),
});

export const reviewEvidenceSchema = z.object({
  id: z.string(),
  mediaType: z.string(),
  mediaUrl: z.string(),
  caption: z.string().nullable(),
});

export const reviewEventSchema = z.object({
  id: z.string(),
  action: z.literal("winner_selected"),
  notes: z.string().nullable(),
  createdAt: z.string(),
});

export const successQueueResponseSchema = z.object({
  success: z.literal(true),
  reviews: z.array(reviewQueueItemSchema),
});

export const successDetailResponseSchema = z.object({
  success: z.literal(true),
  problem: reviewProblemSchema,
  evidence: z.array(reviewEvidenceSchema),
  applications: z.array(reviewApplicationSchema),
  events: z.array(reviewEventSchema),
});

export const successSelectionResponseSchema = z.object({
  success: z.literal(true),
  projectId: z.string(),
  selectedApplicationId: z.string(),
});

export const failureResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

