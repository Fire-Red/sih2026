import { NextResponse } from "next/server";
import { eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { activeProjects, impactVerifications, solutionMemory } from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser, requireGovernmentUser } from "@/lib/auth/server";

const solutionSchema = z.object({
  projectId: z.string().uuid(),
  problemId: z.string().uuid(),
  problemType: z.string().trim().min(2).max(160),
  approach: z.string().trim().min(10).max(5000),
  requirements: z.array(z.string().trim().min(1).max(160)).max(50).optional(),
  measuredResults: z.record(z.string(), z.string()).optional(),
  constraints: z.record(z.string(), z.string()).optional(),
  sourceUrl: z.string().url().optional(),
});

export async function GET(request: Request) {
  try {
    await requireAuthenticatedUser(request);
    const search = new URL(request.url).searchParams.get("q")?.trim();
    const limitValue = Number(new URL(request.url).searchParams.get("limit") ?? "20");
    const limit = Number.isInteger(limitValue) ? Math.max(1, Math.min(50, limitValue)) : 20;
    const solutions = await db
      .select()
      .from(solutionMemory)
      .where(search ? or(ilike(solutionMemory.problemType, `%${search}%`), ilike(solutionMemory.approach, `%${search}%`)) : undefined)
      .limit(limit);
    return NextResponse.json({ success: true, solutions });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to load solution memory." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireGovernmentUser(request);
    const input = solutionSchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid solution details." }, { status: 400 });
    const [project] = await db.select({ id: activeProjects.id }).from(activeProjects).where(eq(activeProjects.id, input.data.projectId)).limit(1);
    if (!project) return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    const [verified] = await db.select({ id: impactVerifications.id }).from(impactVerifications).where(eq(impactVerifications.projectId, input.data.projectId)).limit(1);
    if (!verified) return NextResponse.json({ success: false, error: "Impact must be verified before memory can be created." }, { status: 409 });
    const [solution] = await db.insert(solutionMemory).values({ ...input.data, verificationStatus: "verified" }).returning();
    return NextResponse.json({ success: true, solution }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to save solution memory." }, { status: 500 });
  }
}
