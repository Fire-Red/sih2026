import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { activeProjects, impactMeasurements } from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

const measurementSchema = z.object({
  projectId: z.string().uuid(),
  measurementType: z.enum(["baseline", "during_pilot", "post_intervention", "follow_up"]),
  metricName: z.string().trim().min(2).max(120),
  metricValue: z.string().trim().max(120).optional(),
  metricUnit: z.string().trim().max(40).optional(),
  measuredAt: z.coerce.date().optional(),
  notes: z.string().trim().max(2000).optional(),
  evidenceUrl: z.string().url().optional(),
});

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const projectId = new URL(request.url).searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ success: false, error: "projectId is required." }, { status: 400 });
    const [project] = await db.select({ teamId: activeProjects.teamId }).from(activeProjects).where(eq(activeProjects.id, projectId)).limit(1);
    if (!project) return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    if (user.role !== "government" && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Project oversight access is required." }, { status: 403 });
    }
    const measurements = await db.select().from(impactMeasurements).where(eq(impactMeasurements.projectId, projectId));
    return NextResponse.json({ success: true, measurements });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to load measurements." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    if (!["government", "institution", "student", "admin"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Project access is required." }, { status: 403 });
    }
    const input = measurementSchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid measurement details." }, { status: 400 });
    const [measurement] = await db.insert(impactMeasurements).values({
      ...input.data,
      measuredBy: user.id,
      measuredAt: input.data.measuredAt ?? new Date(),
    }).returning();
    return NextResponse.json({ success: true, measurement }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to save measurement." }, { status: 500 });
  }
}
