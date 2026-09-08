interface ReportProcessingInput {
  reportId: string;
  text: string;
  category: string;
  latitude: string | null;
  longitude: string | null;
}

interface ProcessingResponse {
  success: boolean;
  results?: Array<{
    id: string;
    confidenceLevel?: string;
    reviewMode?: string;
    distanceKm?: number | null;
    similarity?: number;
  }>;
}

function redisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisRequest(command: string, args: string[]): Promise<string | null> {
  if (!redisConfigured()) return null;
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL as string;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;
  const path = [command, ...args].map((value) => encodeURIComponent(value)).join("/");
  const response = await fetch(`${baseUrl}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const body = await response.json() as { result?: string | null };
  return body.result ?? null;
}

export async function processNewReport(input: ReportProcessingInput): Promise<void> {
  const stateKey = `civic:report:${input.reportId}:processing`;
  try {
    await redisRequest("set", [stateKey, "processing", "EX", "3600"]);
    await redisRequest("rpush", ["civic:report-processing", JSON.stringify(input)]);

    const backendUrl = process.env.AI_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/v1/fusion/process-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report_id: input.reportId,
        text: input.text,
        category: input.category,
        latitude: input.latitude ? Number(input.latitude) : null,
        longitude: input.longitude ? Number(input.longitude) : null,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const result = await response.json() as ProcessingResponse;
    const reviewAlerts = (result.results ?? []).filter((match) => match.confidenceLevel === "high" && match.reviewMode === "queue_high_confidence");
    if (reviewAlerts.length > 0) {
      await redisRequest("rpush", ["civic:government:similar-alerts", JSON.stringify({ reportId: input.reportId, matches: reviewAlerts, createdAt: new Date().toISOString() })]);
    }
    await redisRequest("set", [stateKey, result.success ? "complete" : "unavailable", "EX", "3600"]);
  } catch {
    await redisRequest("set", [stateKey, "unavailable", "EX", "3600"]);
  }
}

export async function getReportProcessingState(reportId: string): Promise<"processing" | "complete" | "unavailable" | null> {
  if (!redisConfigured()) return "unavailable";
  const result = await redisRequest("get", [`civic:report:${reportId}:processing`]);
  if (result === "processing" || result === "complete" || result === "unavailable") return result;
  return null;
}
