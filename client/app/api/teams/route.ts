import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { studentTeams } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { requireAuthenticatedUser, AuthorizationError } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    const currentUser = await requireAuthenticatedUser(request);
    const { searchParams } = new URL(request.url);
    const leaderId = searchParams.get("leaderId");

    if (currentUser.role !== "student" && currentUser.role !== "government" && currentUser.role !== "admin") {
      throw new AuthorizationError(403, "Student workspace access is required.");
    }

    const query = db.select().from(studentTeams).orderBy(desc(studentTeams.createdAt));
    const allTeams = await query;

    let filtered = allTeams;
    if (currentUser.role === "student") {
      filtered = filtered.filter((t) => t.leaderId === currentUser.id);
    } else if (leaderId) {
      filtered = filtered.filter((t) => t.leaderId === leaderId);
    }

    return NextResponse.json({ success: true, teams: filtered });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch teams";
    const status = error instanceof AuthorizationError ? error.status : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireAuthenticatedUser(request);
    if (currentUser.role !== "student") {
      throw new AuthorizationError(403, "Student workspace access is required.");
    }
    const body = await request.json();
    const {
      teamName,
      institutionName,
      facultyMentorName,
      members = [],
    } = body;

    if (!teamName || !institutionName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: teamName, leaderId, institutionName" },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(studentTeams)
      .values({
        teamName,
        leaderId: currentUser.id,
        institutionName,
        facultyMentorName: facultyMentorName || null,
        members: members || [],
      })
      .returning();

    return NextResponse.json({ success: true, team: inserted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register team";
    const status = error instanceof AuthorizationError ? error.status : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
