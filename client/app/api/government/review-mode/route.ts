import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { problemReports } from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";

const inputSchema = z.object({
  problemId: z.string().uuid(),
  mode: z.enum(["manual_review", "queue_high_confidence"]),
});

export async function PATCH(request: Request) {
  try {
    await requireGovernmentUser(request);
    const input = inputSchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid review mode." }, { status: 400 });
    const [problem] = await db.update(problemReports)
      .set({ similarReviewMode: input.data.mode, updatedAt: new Date() })
      .where(eq(problemReports.id, input.data.problemId))
      .returning({ id: problemReports.id, similarReviewMode: problemReports.similarReviewMode });
    if (!problem) return NextResponse.json({ success: false, error: "Problem not found." }, { status: 404 });
    return NextResponse.json({ success: true, problem });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to update review mode." }, { status: 500 });
  }
}
