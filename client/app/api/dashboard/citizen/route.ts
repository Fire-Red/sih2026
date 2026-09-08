import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { problemReports, users } from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    const authUser = await requireAuthenticatedUser(request);

    const [user] = await db
      .select({ id: users.id, displayName: users.displayName, role: users.role })
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ success: false, error: "User profile not found" }, { status: 404 });
    }

    const reports = await db
      .select()
      .from(problemReports)
      .where(eq(problemReports.reporterId, user.id))
      .orderBy(desc(problemReports.createdAt));

    return NextResponse.json({
      success: true,
      data: {
        user,
        reports,
        counts: {
          total: reports.length,
          active: reports.filter((report) => report.status !== "resolved_deployed").length,
          resolved: reports.filter((report) => report.status === "resolved_deployed").length,
        },
      },
    });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error("Error loading citizen dashboard:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}

