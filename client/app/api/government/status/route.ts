import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { problemReports } from "@/lib/db/schema";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";

export async function PATCH(request: Request) {
  try {
    await requireGovernmentUser(request);
    const body = await request.json();
    const { problemId, status } = body;

    if (!problemId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing problemId or status." },
        { status: 400 }
      );
    }

    const validStatuses = ["submitted", "under_review", "validated", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(problemReports)
      .set({
        status: status as any,
        updatedAt: new Date(),
      })
      .where(eq(problemReports.id, problemId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Problem report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, problem: updated });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { success: false, error: "Failed to update report status." },
      { status: 500 }
    );
  }
}
