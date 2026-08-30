import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  governmentReviewEvents,
  problemApplications,
  problemEvidence,
  problemReports,
  studentTeams,
} from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";
import { reviewProblemIdSchema } from "@/lib/api/schemas/government-review-schemas";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ problemId: string }>;
}

const membersSchema = z.array(
  z.object({
    name: z.string(),
    role: z.string(),
    year: z.number().int(),
  })
);

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }

  return NextResponse.json(
    { success: false, error: "Unable to load this review." },
    { status: 500 }
  );
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireGovernmentUser(request);
    const { problemId } = await context.params;
    const parsedId = reviewProblemIdSchema.safeParse({ problemId });
    if (!parsedId.success) {
      return NextResponse.json({ success: false, error: "Invalid problem ID." }, { status: 422 });
    }

    const [problem] = await db
      .select()
      .from(problemReports)
      .where(eq(problemReports.id, parsedId.data.problemId))
      .limit(1);

    if (!problem) {
      return NextResponse.json({ success: false, error: "Problem not found." }, { status: 404 });
    }

    const [applications, evidence, events] = await Promise.all([
      db
        .select({ application: problemApplications, team: studentTeams })
        .from(problemApplications)
        .leftJoin(studentTeams, eq(problemApplications.teamId, studentTeams.id))
        .where(eq(problemApplications.problemId, problem.id))
        .orderBy(asc(problemApplications.createdAt)),
      db
        .select()
        .from(problemEvidence)
        .where(eq(problemEvidence.problemReportId, problem.id))
        .orderBy(asc(problemEvidence.createdAt)),
      db
        .select()
        .from(governmentReviewEvents)
        .where(eq(governmentReviewEvents.problemId, problem.id))
        .orderBy(asc(governmentReviewEvents.createdAt)),
    ]);

    return NextResponse.json({
      success: true,
      problem,
      evidence,
      applications: applications.map(({ application, team }) => ({
        id: application.id,
        teamId: application.teamId,
        teamName: team?.teamName ?? "Team information unavailable",
        institutionName: team?.institutionName ?? "Institution not provided",
        members: membersSchema.safeParse(team?.members).success
          ? membersSchema.parse(team?.members)
          : [],
        pitchSummary: application.pitchSummary,
        videoUrl: application.videoUrl,
        pptUrl: application.pptUrl,
        repoUrl: application.repoUrl,
        status: application.status,
        submittedAt: application.createdAt,
        reviewedAt: application.reviewedAt,
        reviewNotes: application.reviewNotes,
      })),
      events: events.map((event) => ({
        id: event.id,
        action: event.action,
        notes: event.notes,
        createdAt: event.createdAt,
      })),
    });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
