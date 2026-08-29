import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activeProjects, problemReports, studentTeams, problemApplications } from "@/lib/db/schema";
import { eq, desc, and, isNull } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const problemId = searchParams.get("problemId");

    const conditions = [];
    if (teamId) {
      conditions.push(eq(activeProjects.teamId, teamId));
    }
    if (problemId) {
      conditions.push(eq(activeProjects.problemId, problemId));
    }

    let query = db
      .select({
        project: activeProjects,
        problem: problemReports,
        team: studentTeams,
      })
      .from(activeProjects)
      .leftJoin(problemReports, eq(activeProjects.problemId, problemReports.id))
      .leftJoin(studentTeams, eq(activeProjects.teamId, studentTeams.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const projects = await query.orderBy(desc(activeProjects.createdAt));

    return NextResponse.json({ success: true, projects });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      problemId,
      teamId,
      applicationId,
      title,
      description,
      milestones,
    } = body;

    if (!problemId || !teamId || !title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: problemId, teamId, title" },
        { status: 400 }
      );
    }

    // Default 4 Milestones
    const projectMilestones = milestones || [
      { id: "m1", title: "Problem Field Study & Ground Truth Assessment", status: "in_progress", dueDate: null },
      { id: "m2", title: "Technical Prototype & Hardware/Software Architecture", status: "pending", dueDate: null },
      { id: "m3", title: "Local Pilot Deployment with Beneficiaries", status: "pending", dueDate: null },
      { id: "m4", title: "Field Impact Verification & CSR Handover", status: "pending", dueDate: null },
    ];

    const result = await db.transaction(async (tx) => {
      // 1. Conditionally update problemReports using selectedTeamId IS NULL predicate
      const updatedReports = await tx
        .update(problemReports)
        .set({
          selectedTeamId: teamId,
          status: "solution_in_progress",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(problemReports.id, problemId),
            isNull(problemReports.selectedTeamId)
          )
        )
        .returning();

      if (updatedReports.length === 0) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Problem not found or a team has already been selected for this problem statement.",
          },
        };
      }

      // 2. If applicationId is provided, update problemApplications requiring matching problemId and teamId
      if (applicationId) {
        const updatedApps = await tx
          .update(problemApplications)
          .set({
            status: "selected_winner",
            reviewedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(problemApplications.id, applicationId),
              eq(problemApplications.problemId, problemId),
              eq(problemApplications.teamId, teamId)
            )
          )
          .returning();

        if (updatedApps.length === 0) {
          throw new Error("Specified application does not exist or does not match the problem and team.");
        }
      }

      // 3. Insert Active Project
      const [project] = await tx
        .insert(activeProjects)
        .values({
          problemId,
          teamId,
          title,
          description: description || null,
          status: "active",
          milestones: projectMilestones,
        })
        .returning();

      return {
        status: 200,
        body: { success: true, project },
      };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
