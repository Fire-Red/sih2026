import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { problemReports } from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    await requireGovernmentUser(request);
    const body = await request.json();
    const {
      problemId,
      mergedReportIds,
      title,
      description,
      maxTeamsAllowed,
      sponsoringDepartment,
      grantAmount,
    } = body;

    if (!problemId || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for publishing problem statement." },
        { status: 400 }
      );
    }

    const maxTeams = typeof maxTeamsAllowed === "number" && maxTeamsAllowed > 0 ? maxTeamsAllowed : 3;

    const published = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(problemReports)
        .set({
          title,
          description,
          status: "validated",
          maxTeamsAllowed: maxTeams,
          sponsoringDepartment: sponsoringDepartment || null,
          grantAmount: grantAmount || null,
          updatedAt: new Date(),
        })
        .where(eq(problemReports.id, problemId))
        .returning();

      if (!updated) {
        return null;
      }

      if (Array.isArray(mergedReportIds) && mergedReportIds.length > 0) {
        await tx
          .update(problemReports)
          .set({
            status: "validated",
            updatedAt: new Date(),
          })
          .where(inArray(problemReports.id, mergedReportIds));
      }

      return updated;
    });

    if (!published) {
      return NextResponse.json(
        { success: false, error: "Problem report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, problem: published });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { success: false, error: "Failed to publish problem statement." },
      { status: 500 }
    );
  }
}
