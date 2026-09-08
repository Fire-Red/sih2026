import { z } from "zod";
import { proxy } from "@/lib/api/proxy";

const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  severity: z.string().nullable().optional(),
  similarity: z.number().optional(),
});

const searchResponseSchema = z.object({
  query: z.string(),
  results: z.array(searchResultSchema),
});

const askResponseSchema = z.object({
  query: z.string(),
  answer: z.string(),
  context_records: z.array(z.record(z.string(), z.unknown())),
});

const agentResponseSchema = z.object({ content: z.string(), tool_calls: z.array(z.unknown()) });

export type AiSearchResult = z.infer<typeof searchResultSchema>;
export type AiAskResponse = z.infer<typeof askResponseSchema>;
export type AiAgentResponse = z.infer<typeof agentResponseSchema>;

const solutionSchema = z.object({
  id: z.string(),
  problemType: z.string(),
  approach: z.string(),
  requirements: z.array(z.string()).nullable().optional(),
  measuredResults: z.record(z.string(), z.unknown()).nullable().optional(),
  constraints: z.record(z.string(), z.unknown()).nullable().optional(),
  verificationStatus: z.string(),
  sourceUrl: z.string().nullable().optional(),
});

const solutionsResponseSchema = z.object({
  success: z.literal(true),
  solutions: z.array(solutionSchema),
});

export type SolutionMemoryItem = z.infer<typeof solutionSchema>;

async function parse<T>(response: Awaited<ReturnType<typeof proxy.post>>, schema: z.ZodType<T>): Promise<T> {
  if (!response.success) throw new Error(response.error ?? "AI request failed.");
  const parsed = schema.safeParse(response.data);
  if (!parsed.success) throw new Error("AI service returned an unexpected response.");
  return parsed.data;
}

export async function askAi(query: string, district?: string): Promise<AiAskResponse> {
  return parse(await proxy.post("/api/ai/rag/ask", { query, district }), askResponseSchema);
}

export async function searchAi(query: string, district?: string): Promise<AiSearchResult[]> {
  const response = await parse(await proxy.post("/api/ai/rag/search", { query, district }), searchResponseSchema);
  return response.results;
}

export async function chatWithAi(prompt: string): Promise<AiAgentResponse> {
  return parse(await proxy.post("/api/ai/agent/chat", { prompt }), agentResponseSchema);
}

export async function getVerifiedSolutions(query: string): Promise<SolutionMemoryItem[]> {
  const response = await proxy.get(`/api/solutions?q=${encodeURIComponent(query)}&limit=5`);
  if (!response.success) throw new Error(response.error ?? "Solution memory is unavailable.");
  const parsed = solutionsResponseSchema.safeParse(response.data);
  if (!parsed.success) throw new Error("Solution memory returned an unexpected response.");
  return parsed.data.solutions.filter((solution) => solution.verificationStatus === "verified");
}
