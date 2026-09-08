"use client";

import { FormEvent, useState } from "react";
import { Bot, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askAi } from "@/lib/api/ai-api";

interface CivicAiAssistantProps {
  context: string;
  district?: string | null;
}

export function CivicAiAssistant({ context, district }: CivicAiAssistantProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = question.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    try {
      const result = await askAi(`${context}\n\nOfficer question: ${value}`, district ?? undefined);
      setAnswer(result.answer);
      setQuestion("");
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "AI assistance is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-muted/40 p-4">
      <div className="flex items-start gap-3">
        <Bot className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-sm font-medium text-foreground">Ask about related records</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">Answers are grounded in available records and are not approval decisions.</p>
        </div>
      </div>
      {answer && <p className="mt-4 whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm leading-relaxed text-foreground">{answer}</p>}
      {error && <p className="mt-3 text-xs text-destructive" role="alert">{error}</p>}
      <form className="mt-4 flex gap-2" onSubmit={submit}>
        <Textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What should I compare in the available records?" rows={2} aria-label="Question for the civic assistant" />
        <Button type="submit" size="icon" disabled={loading || !question.trim()} aria-label="Ask assistant">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </section>
  );
}
