import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthorizationError, requireGovernmentUser } from "@/lib/auth/server";
import { getReportProcessingState } from "@/lib/server/report-processing";

const responseSchema = z.object({ state: z.enum(["processing", "complete", "unavailable"]) });

export async function GET(request: Request) {
  try {
    await requireGovernmentUser(request);
    const reportId = new URL(request.url).searchParams.get("reportId");
    if (!reportId || !z.string().uuid().safeParse(reportId).success) {
      return NextResponse.json({ success: false, error: "A valid reportId is required." }, { status: 400 });
    }
    const state = await getReportProcessingState(reportId);
    return NextResponse.json({ success: true, data: responseSchema.parse({ state: state ?? "processing" }) });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "Unable to load processing status." }, { status: 500 });
  }
}
