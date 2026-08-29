import { NextResponse } from "next/server";
import { and, eq, inArray, ne, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activeProjects,
  governmentReviewEvents,
  problemApplications,
  problemReports,
} from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";
import { reviewProblemIdSchema, selectWinnerSchema } from "@/lib/api/schemas/government-review-schemas";

interface RouteContext {
  params: Promise<{ problemId: string }>;
}

const defaultMilestones = [
  { id: "m1", title: "Problem field study and baseline assessment", status: "in_progress", dueDate: null },
  { id: "m2", title: "Technical prototype and architecture", status: "pending", dueDate: null },
  { id: "m3", title: "Local pilot deployment", status: "pending", dueDate: null },
  { id: "m4", title: "Impact verification and handover", status: "pending", dueDate: null },
] as const;

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }

  return NextResponse.json(
    { success: false, error: "Unable to complete the selection." },
    { status: 500 }
  );
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const reviewerId = await requireGovernmentUser(request);
    const { problemId } = await context.params;
    const parsedProblemId = reviewProblemIdSchema.safeParse({ problemId });
    if (!parsedProblemId.success) {
      return NextResponse.json({ success: false, error: "Invalid problem ID." }, { status: 422 });
    }

    const body = selectWinnerSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json({ success: false, error: "Selection details are invalid." }, { status: 422 });
    }

    const result = await db.transaction(async (tx) => {
      const [application] = await tx
        .select({ id: problemApplications.id, teamId: problemApplications.teamId, pitchSummary: problemApplications.pitchSummary })
        .from(problemApplications)
        .where(
          and(
            eq(problemApplications.id, body.data.applicationId),
            eq(problemApplications.problemId, parsedProblemId.data.problemId),
            inArray(problemApplications.status, ["submitted", "under_review"])
          )
        )
        .limit(1);

      if (!application) {
        return { kind: "not_found" as const };
      }

      const [problem] = await tx
        .select({ id: problemReports.id, title: problemReports.title, selectedTeamId: problemReports.selectedTeamId })
        .from(problemReports)
        .where(
          and(
            eq(problemReports.id, parsedProblemId.data.problemId),
            isNull(problemReports.selectedTeamId)
          )
        )
        .limit(1);

      if (!problem) {
        return { kind: "conflict" as const };
      }

      await tx
        .update(problemReports)
        .set({ selectedTeamId: application.teamId, status: "solution_in_progress", updatedAt: new Date() })
        .where(eq(problemReports.id, problem.id));

      const now = new Date();
      await tx
        .update(problemApplications)
        .set({
          status: "selected_winner",
          reviewedBy: reviewerId,
          reviewedAt: now,
          reviewNotes: body.data.reviewNotes || null,
          updatedAt: now,
        })
        .where(eq(problemApplications.id, application.id));

      await tx
        .update(problemApplications)
        .set({ status: "rejected", reviewedBy: reviewerId, reviewedAt: now, updatedAt: now })
        .where(
          and(
            eq(problemApplications.problemId, problem.id),
            ne(problemApplications.id, application.id),
            inArray(problemApplications.status, ["submitted", "under_review", "shortlisted"])
          )
        );

      await tx.insert(governmentReviewEvents).values({
        problemId: problem.id,
        applicationId: application.id,
        reviewerId,
        action: "winner_selected",
        notes: body.data.reviewNotes || null,
        createdAt: now,
        updatedAt: now,
      });

      const [project] = await tx
        .insert(activeProjects)
        .values({
          problemId: problem.id,
          teamId: application.teamId,
          title: problem.title,
          description: application.pitchSummary,
          status: "active",
          milestones: defaultMilestones,
        })
        .returning({ id: activeProjects.id });

      return { kind: "success" as const, projectId: project.id, applicationId: application.id };
    });

    if (result.kind === "not_found") {
      return NextResponse.json({ success: false, error: "Application not found or no longer available." }, { status: 404 });
    }
    if (result.kind === "conflict") {
      return NextResponse.json({ success: false, error: "This problem already has a selected team." }, { status: 409 });
    }

    return NextResponse.json({ success: true, projectId: result.projectId, selectedApplicationId: result.applicationId });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
