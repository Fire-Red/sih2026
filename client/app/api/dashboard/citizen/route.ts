import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { problemReports, users } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseUid = searchParams.get("firebaseUid");
    if (!firebaseUid) {
      return NextResponse.json({ success: false, error: "A user session is required" }, { status: 400 });
    }

    const [user] = await db
      .select({ id: users.id, displayName: users.displayName, role: users.role })
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid));

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
  } catch (error) {
    console.error("Error loading citizen dashboard:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
