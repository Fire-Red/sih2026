import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { studentTeams, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leaderId = searchParams.get("leaderId");

    const query = db.select().from(studentTeams).orderBy(desc(studentTeams.createdAt));
    const allTeams = await query;

    let filtered = allTeams;
    if (leaderId) {
      filtered = filtered.filter((t) => t.leaderId === leaderId);
    }

    return NextResponse.json({ success: true, teams: filtered });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch teams";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      teamName,
      leaderId,
      institutionName,
      facultyMentorName,
      members = [],
    } = body;

    if (!teamName || !leaderId || !institutionName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: teamName, leaderId, institutionName" },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(studentTeams)
      .values({
        teamName,
        leaderId,
        institutionName,
        facultyMentorName: facultyMentorName || null,
        members: members || [],
      })
      .returning();

    return NextResponse.json({ success: true, team: inserted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register team";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
