import React from "react";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="mb-7 inline-flex items-center gap-2 group">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-transform group-hover:scale-105">
          <span className="text-primary-foreground text-xs font-semibold">C</span>
        </span>
        <span className="text-lg font-medium tracking-[-0.02em] text-foreground">
          CivicPulse
        </span>
      </Link>
      <h1 className="text-3xl font-medium tracking-[-0.04em] text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
