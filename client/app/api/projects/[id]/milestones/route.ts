import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { activeProjects, studentTeams } from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const milestoneSchema = z.object({
  milestoneId: z.string().min(1),
  status: z.enum(["pending", "in_progress", "completed", "overdue", "skipped"]),
  deliverables: z.array(z.string().url()).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { id } = await context.params;
    const input = milestoneSchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid milestone update." }, { status: 400 });

    const [row] = await db.select({ project: activeProjects, team: studentTeams })
      .from(activeProjects)
      .innerJoin(studentTeams, eq(activeProjects.teamId, studentTeams.id))
      .where(eq(activeProjects.id, id))
      .limit(1);
    if (!row) return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    if (user.role !== "government" && row.team.leaderId !== user.id) {
      return NextResponse.json({ success: false, error: "You do not have access to this project." }, { status: 403 });
    }

    const milestones = Array.isArray(row.project.milestones) ? row.project.milestones : [];
    const updated = milestones.map((milestone) => {
      if (!milestone || typeof milestone !== "object" || !("id" in milestone)) return milestone;
      const record = milestone as Record<string, unknown>;
      if (record.id !== input.data.milestoneId) return milestone;
      return { ...record, status: input.data.status, deliverables: input.data.deliverables ?? record.deliverables };
    });
    if (JSON.stringify(updated) === JSON.stringify(milestones)) {
      return NextResponse.json({ success: false, error: "Milestone not found." }, { status: 404 });
    }

    const [project] = await db.update(activeProjects)
      .set({ milestones: updated, updatedAt: new Date() })
      .where(eq(activeProjects.id, id))
      .returning();
    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to update milestone." }, { status: 500 });
  }
}
