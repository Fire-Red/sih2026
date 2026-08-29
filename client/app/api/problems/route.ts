import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemReports } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const status = searchParams.get("status");

    const allProblems = await db.select().from(problemReports).orderBy(desc(problemReports.createdAt));

    let filtered = allProblems;
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (district && district !== "all") {
      filtered = filtered.filter((p) => (p.district ?? "").toLowerCase() === district.toLowerCase());
    }
    if (status && status !== "all") {
      filtered = filtered.filter((p) => p.status === status);
    }

    return NextResponse.json({ success: true, problems: filtered });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch problems";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      subcategory,
      severity = "medium",
      affectedPopulationEstimate = 100,
      state = "Jharkhand",
      district,
      blockOrPanchayat,
      pinCode,
      maxTeamsAllowed = 3,
      sponsoringDepartment,
      grantAmount,
    } = body;

    if (!title || !description || !category || !district) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, description, category, district" },
        { status: 400 }
      );
    }

    let parsedMaxTeams = 3;
    if (maxTeamsAllowed !== undefined && maxTeamsAllowed !== null) {
      const num = Number(maxTeamsAllowed);
      if (!Number.isInteger(num) || num <= 0) {
        return NextResponse.json(
          { success: false, error: "maxTeamsAllowed must be a positive integer" },
          { status: 400 }
        );
      }
      parsedMaxTeams = num;
    }

    const [inserted] = await db
      .insert(problemReports)
      .values({
        title,
        description,
        category,
        subcategory: subcategory || null,
        severity,
        affectedPopulationEstimate: parseInt(String(affectedPopulationEstimate), 10) || 100,
        state,
        district,
        blockOrPanchayat: blockOrPanchayat || null,
        pinCode: pinCode || null,
        status: "validated",
        maxTeamsAllowed: parsedMaxTeams,
        sponsoringDepartment: sponsoringDepartment || null,
        grantAmount: grantAmount || null,
      })
      .returning();

    return NextResponse.json({ success: true, problem: inserted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create problem";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
