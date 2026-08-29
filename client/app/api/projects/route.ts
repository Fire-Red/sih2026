import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activeProjects, problemReports, studentTeams, problemApplications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const problemId = searchParams.get("problemId");

    const allProjects = await db
      .select({
        project: activeProjects,
        problem: problemReports,
        team: studentTeams,
      })
      .from(activeProjects)
      .leftJoin(problemReports, eq(activeProjects.problemId, problemReports.id))
      .leftJoin(studentTeams, eq(activeProjects.teamId, studentTeams.id))
      .orderBy(desc(activeProjects.createdAt));

    let filtered = allProjects;
    if (teamId) {
      filtered = filtered.filter((p) => p.project.teamId === teamId);
    }
    if (problemId) {
      filtered = filtered.filter((p) => p.project.problemId === problemId);
    }

    return NextResponse.json({ success: true, projects: filtered });
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
    const defaultMilestones = milestones || [
      { id: "m1", title: "Problem Field Study & Ground Truth Assessment", status: "in_progress", dueDate: null },
      { id: "m2", title: "Technical Prototype & Hardware/Software Architecture", status: "pending", dueDate: null },
      { id: "m3", title: "Local Pilot Deployment with Beneficiaries", status: "pending", dueDate: null },
      { id: "m4", title: "Field Impact Verification & CSR Handover", status: "pending", dueDate: null },
    ];

    // Create Active Project
    const [project] = await db
      .insert(activeProjects)
      .values({
        problemId,
        teamId,
        title,
        description: description || null,
        status: "active",
        milestones: defaultMilestones,
      })
      .returning();

    // Mark application as winner if provided
    if (applicationId) {
      await db
        .update(problemApplications)
        .set({
          status: "selected_winner",
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(problemApplications.id, applicationId));
    }

    // Update Problem with selectedTeamId
    await db
      .update(problemReports)
      .set({
        selectedTeamId: teamId,
        status: "solution_in_progress",
        updatedAt: new Date(),
      })
      .where(eq(problemReports.id, problemId));

    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
