import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemReports } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [updatedReport] = await db
      .update(problemReports)
      .set({
        endorsementCount: sql`${problemReports.endorsementCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(problemReports.id, id))
      .returning();

    if (!updatedReport) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      endorsementCount: updatedReport.endorsementCount,
      message: "Endorsement recorded",
    });
  } catch (error) {
    console.error("Error endorsing report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record endorsement" },
      { status: 500 }
    );
  }
}
