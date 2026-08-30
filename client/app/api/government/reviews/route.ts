import { NextResponse } from "next/server";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { problemApplications, problemReports } from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }

  return NextResponse.json(
    { success: false, error: "Unable to load the review queue." },
    { status: 500 }
  );
}

export async function GET(request: Request) {
  try {
    await requireGovernmentUser(request);

    const rows = await db
      .select({
        problem: problemReports,
        applicationStatus: problemApplications.status,
      })
      .from(problemReports)
      .leftJoin(
        problemApplications,
        eq(problemApplications.problemId, problemReports.id)
      )
      .where(isNull(problemReports.selectedTeamId))
      .orderBy(desc(problemReports.updatedAt));

    const reviews = rows.reduce<
      Array<{
        problem: (typeof rows)[number]["problem"];
        applicationCount: number;
        pendingApplicationCount: number;
        selectedTeamId: string | null;
      }>
    >((items, row) => {
      const existing = items.find((item) => item.problem.id === row.problem.id);
      const isPending = row.applicationStatus === "submitted" || row.applicationStatus === "under_review";
      if (existing) {
        if (row.applicationStatus) existing.applicationCount += 1;
        if (isPending) existing.pendingApplicationCount += 1;
        return items;
      }

      items.push({
        problem: row.problem,
        applicationCount: row.applicationStatus ? 1 : 0,
        pendingApplicationCount: isPending ? 1 : 0,
        selectedTeamId: row.problem.selectedTeamId,
      });
      return items;
    }, []);

    return NextResponse.json({ success: true, reviews });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
