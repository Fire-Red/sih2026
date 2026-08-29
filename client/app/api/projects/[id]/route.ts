import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activeProjects,
  problemApplications,
  problemReports,
  studentTeams,
} from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }
  return NextResponse.json({ success: false, error: "Unable to load this project." }, { status: 500 });
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { id } = await context.params;
    const [row] = await db
      .select({ project: activeProjects, problem: problemReports, team: studentTeams, application: problemApplications })
      .from(activeProjects)
      .leftJoin(problemReports, eq(activeProjects.problemId, problemReports.id))
      .leftJoin(studentTeams, eq(activeProjects.teamId, studentTeams.id))
      .leftJoin(
        problemApplications,
        and(
          eq(problemApplications.problemId, activeProjects.problemId),
          eq(problemApplications.teamId, activeProjects.teamId),
          eq(problemApplications.status, "selected_winner")
        )
      )
      .where(eq(activeProjects.id, id))
      .limit(1);

    if (!row?.project || !row.problem || !row.team) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    const canView = user.role === "government" || row.team.leaderId === user.id;
    if (!canView) {
      return NextResponse.json({ success: false, error: "You do not have access to this project." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      project: row.project,
      problem: {
        id: row.problem.id,
        title: row.problem.title,
        category: row.problem.category,
        district: row.problem.district,
      },
      team: {
        id: row.team.id,
        teamName: row.team.teamName,
        institutionName: row.team.institutionName,
      },
      application: row.application
        ? { pitchSummary: row.application.pitchSummary, videoUrl: row.application.videoUrl }
        : null,
    });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
