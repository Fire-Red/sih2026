import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemEvidence, problemReports } from "@/lib/db/schema";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { PUBLIC_PROBLEM_STATUSES } from "../route";

interface ProblemRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: ProblemRouteContext) {
  try {
    const { id } = await context.params;
    const [problem] = await db.select().from(problemReports).where(eq(problemReports.id, id));
    if (!problem) return NextResponse.json({ success: false, error: "Problem not found" }, { status: 404 });

    const isPublicStatus = PUBLIC_PROBLEM_STATUSES.includes(
      problem.status as typeof PUBLIC_PROBLEM_STATUSES[number]
    );

    if (!isPublicStatus) {
      try {
        await requireAuthenticatedUser(request);
      } catch {
        return NextResponse.json({ success: false, error: "Problem not found" }, { status: 404 });
      }
    }

    const evidence = await db.select().from(problemEvidence).where(eq(problemEvidence.problemReportId, id));
    return NextResponse.json({ success: true, problem, evidence });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load problem";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
