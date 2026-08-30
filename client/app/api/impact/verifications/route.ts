import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { activeProjects, impactVerifications } from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";

const verificationSchema = z.object({
  projectId: z.string().uuid(),
  verificationType: z.enum(["government", "community", "third_party"]),
  baselineSummary: z.string().trim().min(1).max(3000),
  outcomeSummary: z.string().trim().min(1).max(3000),
  isImpactVerified: z.boolean(),
  verificationNotes: z.string().trim().max(3000).optional(),
});

export async function POST(request: Request) {
  try {
    const reviewerId = await requireGovernmentUser(request);
    const input = verificationSchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid verification details." }, { status: 400 });
    const [project] = await db.select({ id: activeProjects.id }).from(activeProjects).where(eq(activeProjects.id, input.data.projectId)).limit(1);
    if (!project) return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    const [verification] = await db.insert(impactVerifications).values({ ...input.data, verifiedBy: reviewerId }).returning();
    if (input.data.isImpactVerified) {
      await db.update(activeProjects).set({ status: "completed", updatedAt: new Date() }).where(eq(activeProjects.id, input.data.projectId));
    }
    return NextResponse.json({ success: true, verification }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to record verification." }, { status: 500 });
  }
}
