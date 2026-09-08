"use client";

import { Clock3, ExternalLink, History, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SimilarReportMatch } from "@/types/government-review";
import type { SolutionMemoryItem } from "@/lib/api/ai-api";

interface GovernmentAiEvidenceProps {
  matches: SimilarReportMatch[];
  solutions: SolutionMemoryItem[];
  solutionsLoading: boolean;
  solutionsError: string | null;
}

function latestMatch(matches: SimilarReportMatch[]): SimilarReportMatch | null {
  return matches.reduce<SimilarReportMatch | null>((latest, match) => {
    if (!match.createdAt) return latest;
    if (!latest?.createdAt) return match;
    return new Date(match.createdAt) > new Date(latest.createdAt) ? match : latest;
  }, null);
}

function dateLabel(value: string | null): string {
  if (!value) return "Date not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function GovernmentAiEvidence({ matches, solutions, solutionsLoading, solutionsError }: GovernmentAiEvidenceProps) {
  const latest = latestMatch(matches);

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <History className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-medium text-foreground">Latest matching submission</h2>
            <p className="mt-1 text-xs text-muted-foreground">The newest report that the similarity service returned for this issue.</p>
          </div>
        </div>
        {latest ? (
          <div className="mt-4 space-y-2 border-t border-border pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline"><Clock3 className="mr-1 h-3 w-3" />{dateLabel(latest.createdAt)}</Badge>
              {latest.distanceKm !== null && <Badge variant="outline"><MapPin className="mr-1 h-3 w-3" />{latest.distanceKm} km away</Badge>}
            </div>
            <p className="text-sm font-medium text-foreground">{latest.title}</p>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{latest.description}</p>
            <p className="text-[11px] text-muted-foreground">{latest.district ?? "Location not available"}</p>
          </div>
        ) : (
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">No dated matching submission is available yet.</p>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-medium text-foreground">Prior verified solutions</h2>
            <p className="mt-1 text-xs text-muted-foreground">Only recorded outcomes with explicit verification appear here.</p>
          </div>
        </div>
        {solutionsLoading ? (
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">Searching solution memory...</p>
        ) : solutionsError ? (
          <p className="mt-4 border-t border-border pt-3 text-xs text-destructive" role="alert">{solutionsError}</p>
        ) : solutions.length === 0 ? (
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">No verified prior solution found for this problem.</p>
        ) : (
          <div className="mt-4 space-y-3 border-t border-border pt-3">
            {solutions.map((solution) => (
              <article key={solution.id} className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="success">Verified record</Badge>
                  <span className="text-xs font-medium text-foreground">{solution.problemType}</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground">{solution.approach}</p>
                {solution.requirements?.length ? <p className="text-[11px] text-muted-foreground">Capabilities: {solution.requirements.join(", ")}</p> : null}
                {solution.sourceUrl && <a href={solution.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-[11px] text-primary hover:underline">Source <ExternalLink className="ml-1 h-3 w-3" /></a>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
