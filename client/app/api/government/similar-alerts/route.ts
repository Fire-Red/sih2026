import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { problemRelationships, problemReports } from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    await requireGovernmentUser(request);
    const rows = await db.select({ relationship: problemRelationships, relatedReport: problemReports })
      .from(problemRelationships)
      .innerJoin(problemReports, eq(problemRelationships.relatedReportId, problemReports.id))
      .where(eq(problemRelationships.confidenceLevel, "high"))
      .orderBy(desc(problemRelationships.createdAt))
      .limit(20);
    return NextResponse.json({ success: true, alerts: rows });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to load similarity alerts." }, { status: 500 });
  }
}
