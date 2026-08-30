import { Code2, FileText, Play, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewApplication } from "@/types/government-review";

interface ReviewProposalCardProps {
  application: ReviewApplication;
  selected: boolean;
  disabled: boolean;
  onSelect: (application: ReviewApplication) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function ReviewProposalCard({ application, selected, disabled, onSelect }: ReviewProposalCardProps) {
  const statusLabel = application.status === "selected_winner" ? "Selected" : application.status.replace("_", " ");

  return (
    <Card className={selected ? "border-primary ring-1 ring-primary/20" : undefined}>
      <CardHeader className="gap-3 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base font-medium tracking-[-0.02em]">{application.teamName}</CardTitle>
          <p className="text-sm text-muted-foreground">{application.institutionName}</p>
        </div>
        <Badge variant={selected ? "default" : "secondary"} className="w-fit capitalize">
          {statusLabel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" aria-hidden="true" />{application.members.length} members</span>
          <span>Submitted {formatDate(application.submittedAt)}</span>
        </div>
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Approach</p>
          <p className="text-sm leading-6 text-foreground">{application.pitchSummary}</p>
        </div>
        <ul className="space-y-2 border-t border-border pt-4 text-sm">
          {application.members.map((member) => (
            <li key={`${application.id}-${member.name}`} className="flex flex-wrap justify-between gap-2">
              <span className="font-medium text-foreground">{member.name}</span>
              <span className="text-muted-foreground">{member.role}, year {member.year}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          {application.videoUrl ? <a className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:text-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={application.videoUrl} target="_blank" rel="noreferrer"><Play className="h-4 w-4" aria-hidden="true" />Watch video</a> : <span className="text-sm text-muted-foreground">Video unavailable</span>}
          {application.pptUrl ? <a className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={application.pptUrl} target="_blank" rel="noreferrer"><FileText className="h-4 w-4" aria-hidden="true" />View deck</a> : <span className="text-sm text-muted-foreground">Deck unavailable</span>}
          {application.repoUrl && <a className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={application.repoUrl} target="_blank" rel="noreferrer"><Code2 className="h-4 w-4" aria-hidden="true" />Repository</a>}
          {!selected && application.status !== "rejected" && <Button type="button" className="ml-auto min-h-11" disabled={disabled} onClick={() => onSelect(application)}>Select team</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
