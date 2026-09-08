import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { problemReports, reportEndorsements } from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { id } = await context.params;

    const result = await db.transaction(async (tx) => {
      const [report] = await tx
        .select({ id: problemReports.id })
        .from(problemReports)
        .where(eq(problemReports.id, id))
        .limit(1);

      if (!report) return null;

      const [endorsement] = await tx
        .insert(reportEndorsements)
        .values({ reportId: id, userId: user.id })
        .onConflictDoNothing()
        .returning();

      if (endorsement) {
        await tx
          .update(problemReports)
          .set({ endorsementCount: sql`${problemReports.endorsementCount} + 1`, updatedAt: new Date() })
          .where(eq(problemReports.id, id));
      }

      const [updated] = await tx
        .select({ endorsementCount: problemReports.endorsementCount })
        .from(problemReports)
        .where(eq(problemReports.id, id));

      return { endorsed: Boolean(endorsement), endorsementCount: updated?.endorsementCount ?? 0 };
    });

    if (!result) return NextResponse.json({ success: false, error: "Report not found." }, { status: 404 });
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Unable to record support." }, { status: 500 });
  }
}
