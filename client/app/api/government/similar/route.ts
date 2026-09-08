import { NextResponse } from "next/server";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    await requireGovernmentUser(request);
    const body = await request.json();
    const { reportId, text, category, latitude, longitude } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Text query is required." },
        { status: 400 }
      );
    }

    const aiBackendUrl = process.env.AI_BACKEND_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${aiBackendUrl}/api/v1/fusion/find-related`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report_id: reportId || null,
        text,
        category: category || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        limit: 5,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ success: true, results: [] });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, results: data.results || [] });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: true, results: [] });
  }
}
