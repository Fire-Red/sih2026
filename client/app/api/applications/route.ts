import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemApplications, problemReports, studentTeams } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    const teamId = searchParams.get("teamId");

    const allApps = await db
      .select({
        application: problemApplications,
        team: studentTeams,
        problem: problemReports,
      })
      .from(problemApplications)
      .leftJoin(studentTeams, eq(problemApplications.teamId, studentTeams.id))
      .leftJoin(problemReports, eq(problemApplications.problemId, problemReports.id))
      .orderBy(desc(problemApplications.createdAt));

    let filtered = allApps;
    if (problemId) {
      filtered = filtered.filter((a) => a.application.problemId === problemId);
    }
    if (teamId) {
      filtered = filtered.filter((a) => a.application.teamId === teamId);
    }

    return NextResponse.json({ success: true, applications: filtered });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch applications";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      problemId,
      teamId,
      applicantUserId,
      pitchSummary,
      videoUrl,
      pptUrl,
      repoUrl,
    } = body;

    if (!problemId || !teamId || !pitchSummary) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: problemId, teamId, pitchSummary" },
        { status: 400 }
      );
    }

    // Check quota on problem
    const [problem] = await db
      .select()
      .from(problemReports)
      .where(eq(problemReports.id, problemId));

    if (!problem) {
      return NextResponse.json({ success: false, error: "Problem statement not found" }, { status: 404 });
    }

    if (problem.appliedTeamsCount >= problem.maxTeamsAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Application quota reached. Max ${problem.maxTeamsAllowed} teams are allowed for this problem statement.`,
        },
        { status: 400 }
      );
    }

    // Insert Application
    const [inserted] = await db
      .insert(problemApplications)
      .values({
        problemId,
        teamId,
        applicantUserId: applicantUserId || null,
        pitchSummary,
        videoUrl: videoUrl || null,
        pptUrl: pptUrl || null,
        repoUrl: repoUrl || null,
        status: "submitted",
      })
      .returning();

    // Increment appliedTeamsCount
    await db
      .update(problemReports)
      .set({
        appliedTeamsCount: problem.appliedTeamsCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(problemReports.id, problemId));

    return NextResponse.json({ success: true, application: inserted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit application";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
