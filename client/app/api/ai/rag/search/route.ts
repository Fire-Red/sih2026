import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

const requestSchema = z.object({
  query: z.string().trim().min(2).max(2000),
  district: z.string().trim().max(120).optional(),
  limit: z.number().int().min(1).max(20).optional(),
});

async function forward(path: string, payload: Record<string, string | number | undefined>) {
  const backendUrl = process.env.AI_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return fetch(`${backendUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function POST(request: Request) {
  try {
    await requireAuthenticatedUser(request);
    const input = requestSchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid search request." }, { status: 400 });
    const response = await forward("/api/v1/rag/search", input.data);
    const payload: unknown = await response.json();
    if (!response.ok) return NextResponse.json({ success: false, error: "AI search is currently unavailable." }, { status: 503 });
    return NextResponse.json({ success: true, data: payload });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "AI search is currently unavailable." }, { status: 503 });
  }
}
