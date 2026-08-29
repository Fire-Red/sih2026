import { z } from "zod";

export const reviewProblemIdSchema = z.object({
  problemId: z.string().uuid(),
});

export const selectWinnerSchema = z.object({
  applicationId: z.string().uuid(),
  reviewNotes: z.string().trim().max(2000).optional(),
});

export type SelectWinnerInput = z.infer<typeof selectWinnerSchema>;
