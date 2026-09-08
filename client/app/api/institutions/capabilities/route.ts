import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { institutionCapabilities, institutions } from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

const capabilitySchema = z.object({
  institutionId: z.string().uuid(),
  capability: z.string().trim().min(2).max(160),
  department: z.string().trim().max(160).optional(),
  researchArea: z.string().trim().max(160).optional(),
  description: z.string().trim().max(2000).optional(),
  sourceUrl: z.string().url().optional(),
  sourceType: z.enum(["official", "department_page", "research_page", "lab_page", "self_reported"]).default("self_reported"),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    if (user.role !== "institution" && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Institution access is required." }, { status: 403 });
    }
    const input = capabilitySchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid capability details." }, { status: 400 });

    const [institution] = await db.select().from(institutions).where(eq(institutions.id, input.data.institutionId)).limit(1);
    if (!institution) return NextResponse.json({ success: false, error: "Institution not found." }, { status: 404 });

    const [capability] = await db.insert(institutionCapabilities).values({
      ...input.data,
      verificationStatus: "needs_review",
    }).returning();
    return NextResponse.json({ success: true, capability }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Unable to add capability." }, { status: 500 });
  }
}
