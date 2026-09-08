"use client";

import { useState, useRef } from "react";
import { Video, Users, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrophyAwardIcon, EvidenceDocIcon } from "@/components/ui/civic-icons";
import type { ReviewApplication } from "@/types/government-review";

interface ApplicationPitchMatrixProps {
  applications: ReviewApplication[];
  disabled: boolean;
  onSelectWinner: (application: ReviewApplication) => void;
}

function toYouTubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be" || parsed.hostname.endsWith(".youtu.be")) {
      const videoId = parsed.pathname.replace(/^\//, "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname === "youtube.com" || parsed.hostname.endsWith(".youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (parsed.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    // fallback
  }
  return url.replace("watch?v=", "embed/");
}

export function ApplicationPitchMatrix({
  applications,
  disabled,
  onSelectWinner,
}: ApplicationPitchMatrixProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const videoDialogRef = useRef<HTMLDialogElement>(null);

  const openVideo = (url: string) => {
    setActiveVideoUrl(url);
    videoDialogRef.current?.showModal();
  };

  const closeVideo = () => {
    videoDialogRef.current?.close();
    setActiveVideoUrl(null);
  };

  if (applications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2">
        <TrophyAwardIcon className="h-4 w-4 text-primary" />
        <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Student Team Pitches ({applications.length})
        </h4>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {applications.map((app) => {
          const isWinner = app.status === "selected_winner";
          return (
            <div
              key={app.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                isWinner
                  ? "border-semantic-up bg-semantic-up/5"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-primary">
                      {app.institutionName}
                    </span>
                    <h5 className="text-sm font-medium text-foreground">
                      {app.teamName}
                    </h5>
                  </div>
                  {isWinner ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-semantic-up/10 px-2 py-0.5 font-mono text-[10px] text-semantic-up">
                      <TrophyAwardIcon className="h-3 w-3" />
                      Awarded Team
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-soft px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {app.status.replace("_", " ")}
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  {app.pitchSummary}
                </p>

                {app.members.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      {app.members.map((m) => `${m.name} (${m.role})`).join(", ")}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {app.videoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openVideo(app.videoUrl!)}
                      className="h-7 text-xs border-border"
                    >
                      <Video className="mr-1 h-3 w-3 text-primary" />
                      Watch 3-Min Pitch
                    </Button>
                  )}

                  {app.pptUrl && (
                    <a
                      href={app.pptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-7 items-center rounded-md border border-border bg-surface px-2.5 text-xs text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <EvidenceDocIcon className="mr-1 h-3 w-3 text-primary" />
                      Slide Deck
                      <ExternalLink className="ml-1 h-2.5 w-2.5 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>

              {!isWinner && (
                <div className="mt-4 pt-3 border-t border-border">
                  <Button
                    type="button"
                    size="sm"
                    disabled={disabled}
                    onClick={() => onSelectWinner(app)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    <TrophyAwardIcon className="mr-1.5 h-3.5 w-3.5" />
                    Award Challenge to Team
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <dialog
        ref={videoDialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Student Pitch Video
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={closeVideo}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          {activeVideoUrl && (
            activeVideoUrl.includes("youtube.com") || activeVideoUrl.includes("youtu.be") ? (
              <iframe
                src={toYouTubeEmbedUrl(activeVideoUrl)}
                title="Student pitch video"
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            )
          )}
        </div>
      </dialog>
    </div>
  );
}
