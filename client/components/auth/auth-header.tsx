import React from "react";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
        <span className="w-5 h-5 rounded-full bg-primary inline-block transition-transform group-hover:scale-105" />
        <span className="font-medium text-lg tracking-[-0.02em] text-foreground">
          CivicPulse
        </span>
      </Link>
      <h1 className="text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
