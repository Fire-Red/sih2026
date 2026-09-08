import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

const requestSchema = z.object({ prompt: z.string().trim().min(2).max(4000) });

export async function POST(request: Request) {
  try {
    await requireAuthenticatedUser(request);
    const input = requestSchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ success: false, error: "Invalid assistant request." }, { status: 400 });
    const backendUrl = process.env.AI_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/v1/agent/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.data),
      cache: "no-store",
    });
    const payload: unknown = await response.json();
    if (!response.ok) return NextResponse.json({ success: false, error: "AI assistant is currently unavailable." }, { status: 503 });
    return NextResponse.json({ success: true, data: payload });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    return NextResponse.json({ success: false, error: "AI assistant is currently unavailable." }, { status: 503 });
  }
}
