import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemApplications, problemReports, studentTeams } from "@/lib/db/schema";
import { eq, desc, and, lt, sql } from "drizzle-orm";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    const currentUser = await requireAuthenticatedUser(request);
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    const teamId = searchParams.get("teamId");

    const conditions = [];
    if (problemId) {
      conditions.push(eq(problemApplications.problemId, problemId));
    }
    if (teamId) {
      conditions.push(eq(problemApplications.teamId, teamId));
    }

    let query = db
      .select({
        application: problemApplications,
        team: studentTeams,
        problem: problemReports,
      })
      .from(problemApplications)
      .leftJoin(studentTeams, eq(problemApplications.teamId, studentTeams.id))
      .leftJoin(problemReports, eq(problemApplications.problemId, problemReports.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const applications = await query.orderBy(desc(problemApplications.createdAt));
    const visibleApplications = currentUser.role === "government" || currentUser.role === "admin"
      ? applications
      : applications.filter((row) => row.team?.leaderId === currentUser.id || row.application.applicantUserId === currentUser.id);

    return NextResponse.json({ success: true, applications: visibleApplications });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch applications";
    const status = error instanceof AuthorizationError ? error.status : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireAuthenticatedUser(request);
    if (currentUser.role !== "student") {
      throw new AuthorizationError(403, "Student workspace access is required.");
    }
    const body = await request.json();
    const {
      problemId,
      teamId,
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

    const result = await db.transaction(async (tx) => {
      // Check existing application to avoid duplicate count
      const [existingApp] = await tx
        .select({ id: problemApplications.id })
        .from(problemApplications)
        .where(
          and(
            eq(problemApplications.problemId, problemId),
            eq(problemApplications.teamId, teamId)
          )
        );

      if (existingApp) {
        return {
          status: 400,
          body: { success: false, error: "An application has already been submitted by this team for this problem statement." },
        };
      }

      // Check problem exists
      const [team] = await tx
        .select({ id: studentTeams.id, leaderId: studentTeams.leaderId })
        .from(studentTeams)
        .where(eq(studentTeams.id, teamId));

      if (!team || team.leaderId !== currentUser.id) {
        return {
          status: 403,
          body: { success: false, error: "You can only submit for a team you lead." },
        };
      }

      const [problem] = await tx
        .select()
        .from(problemReports)
        .where(eq(problemReports.id, problemId));

      if (!problem) {
        return {
          status: 404,
          body: { success: false, error: "Problem statement not found" },
        };
      }

      // Conditional DB-side increment: only succeeds when appliedTeamsCount < maxTeamsAllowed
      const updatedReports = await tx
        .update(problemReports)
        .set({
          appliedTeamsCount: sql`${problemReports.appliedTeamsCount} + 1`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(problemReports.id, problemId),
            lt(problemReports.appliedTeamsCount, problemReports.maxTeamsAllowed)
          )
        )
        .returning();

      if (updatedReports.length === 0) {
        return {
          status: 400,
          body: {
            success: false,
            error: `Application quota reached. Max ${problem.maxTeamsAllowed} teams are allowed for this problem statement.`,
          },
        };
      }

      // Insert Application within the same transaction
      const [inserted] = await tx
        .insert(problemApplications)
        .values({
          problemId,
          teamId,
          applicantUserId: currentUser.id,
          pitchSummary,
          videoUrl: videoUrl || null,
          pptUrl: pptUrl || null,
          repoUrl: repoUrl || null,
          status: "submitted",
        })
        .returning();

      return {
        status: 200,
        body: { success: true, application: inserted },
      };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit application";
    const status = error instanceof AuthorizationError ? error.status : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
