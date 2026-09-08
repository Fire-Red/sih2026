"use client";

import { useState, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvidenceDocIcon, EvidencePhotoIcon } from "@/components/ui/civic-icons";
import type { ReviewEvidence } from "@/types/government-review";

interface ReportEvidenceGalleryProps {
  evidence: ReviewEvidence[];
}

export function ReportEvidenceGallery({ evidence }: ReportEvidenceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (evidence.length === 0) {
    return (
      <div className="rounded-xl bg-surface-soft/60 p-4 text-xs text-muted-foreground">
        No photographic evidence attached to this report.
      </div>
    );
  }

  const openImage = (url: string) => {
    setSelectedImage(url);
    dialogRef.current?.showModal();
  };

  const closeImage = () => {
    dialogRef.current?.close();
    setSelectedImage(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <EvidencePhotoIcon className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Citizen Evidence ({evidence.length})
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {evidence.map((item) => {
          const isImage =
            item.mediaType === "image" ||
            item.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i);

          if (isImage) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openImage(item.mediaUrl)}
                className="group relative h-20 w-24 overflow-hidden rounded-lg border border-border bg-surface-soft text-left transition-all hover:scale-[1.02] hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
              >
                <img
                  src={item.mediaUrl}
                  alt={item.caption || "Problem evidence"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              </button>
            );
          }

          return (
            <a
              key={item.id}
              href={item.mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-20 items-center gap-2.5 rounded-lg border border-border bg-surface px-4 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <EvidenceDocIcon className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">Attachment</span>
                <span className="block max-w-[140px] truncate text-xs">{item.caption || "View document"}</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground ml-1" />
            </a>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-4xl rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Full-size evidence preview
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={closeImage}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative flex max-h-[75vh] min-h-[300px] w-full items-center justify-center bg-surface-soft p-4">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size evidence"
              className="max-h-[70vh] w-auto max-w-full rounded-md object-contain"
            />
          )}
        </div>
      </dialog>
    </div>
  );
}
