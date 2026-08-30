import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemEvidence, problemReports } from "@/lib/db/schema";

interface ProblemRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: ProblemRouteContext) {
  try {
    const { id } = await context.params;
    const [problem] = await db.select().from(problemReports).where(eq(problemReports.id, id));
    if (!problem) return NextResponse.json({ success: false, error: "Problem not found" }, { status: 404 });
    const evidence = await db.select().from(problemEvidence).where(eq(problemEvidence.problemReportId, id));
    return NextResponse.json({ success: true, problem, evidence });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load problem";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
