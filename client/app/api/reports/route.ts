import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemReports, problemEvidence } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district");
    const category = searchParams.get("category");
    const reporterId = searchParams.get("reporterId");

    let query = db.select().from(problemReports).orderBy(desc(problemReports.createdAt));

    const reports = await query;

    // Filter in-memory or refine with conditions
    let filtered = reports;
    if (district && district !== "all") {
      filtered = filtered.filter((r) => r.district.toLowerCase() === district.toLowerCase());
    }
    if (category && category !== "all") {
      filtered = filtered.filter((r) => r.category === category);
    }
    if (reporterId) {
      filtered = filtered.filter((r) => r.reporterId === reporterId);
    }

    return NextResponse.json({ success: true, reports: filtered });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch problem reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      reporterId,
      title,
      description,
      category,
      subcategory,
      severity,
      affectedPopulationEstimate,
      state = "Jharkhand",
      district,
      blockOrPanchayat,
      pinCode,
      latitude,
      longitude,
      formattedAddress,
      evidence = [],
    } = body;

    if (!title || !description || !category || !district) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, description, category, district" },
        { status: 400 }
      );
    }

    // Insert Report
    const [insertedReport] = await db
      .insert(problemReports)
      .values({
        reporterId: reporterId || null,
        title,
        description,
        category,
        subcategory: subcategory || null,
        severity: severity || "medium",
        affectedPopulationEstimate: affectedPopulationEstimate ? parseInt(affectedPopulationEstimate, 10) : 100,
        state,
        district,
        blockOrPanchayat: blockOrPanchayat || null,
        pinCode: pinCode || null,
        latitude: latitude ? String(latitude) : null,
        longitude: longitude ? String(longitude) : null,
        formattedAddress: formattedAddress || null,
        status: "submitted",
        endorsementCount: 1,
      })
      .returning();

    // Insert Evidence if present
    if (evidence && Array.isArray(evidence) && evidence.length > 0) {
      const evidenceValues = evidence.map((item: { mediaType?: string; mediaUrl: string; caption?: string }) => ({
        problemReportId: insertedReport.id,
        mediaType: item.mediaType || "image",
        mediaUrl: item.mediaUrl,
        caption: item.caption || null,
      }));
      await db.insert(problemEvidence).values(evidenceValues);
    }

    return NextResponse.json({
      success: true,
      report: insertedReport,
      message: "Report successfully submitted and registered in the intelligence pipeline",
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit problem report" },
      { status: 500 }
    );
  }
}
