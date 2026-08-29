import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemReports, problemEvidence, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [report] = await db
      .select()
      .from(problemReports)
      .where(eq(problemReports.id, id));

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    const evidenceList = await db
      .select()
      .from(problemEvidence)
      .where(eq(problemEvidence.problemReportId, id));

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        evidence: evidenceList,
      },
    });
  } catch (error) {
    console.error("Error fetching single report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report details" },
      { status: 500 }
    );
  }
}
