import React from "react";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink-strong">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[15px] text-ink-caption">
          {subtitle}
        </p>
      )}
    </div>
  );
}
