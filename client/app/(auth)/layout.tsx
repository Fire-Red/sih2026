import React from "react";
import Link from "next/link";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-3xl">
            <Link
              href="/"
              className="mb-10 inline-block text-[15px] font-semibold tracking-[-0.03em] text-ink-strong"
            >
              CivicPulse
            </Link>
            <AuthRouteGuard>{children}</AuthRouteGuard>
          </div>
        </div>

        <div className="hidden border-l border-border bg-surface-inset lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12">
          <div className="max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-caption">
              Civic Intelligence Platform
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink-strong">
              Turn community signals into verified systemic solutions.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-body">
              A structured intelligence pipeline connecting citizen reports,
              government validation, university capabilities, and field
              verification into measurable impact.
            </p>
            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-mono font-medium text-primary">
                  1
                </span>
                <p className="text-[13px] text-ink-caption">
                  Citizens report. Reports are normalized and embedded.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-mono font-medium text-primary">
                  2
                </span>
                <p className="text-[13px] text-ink-caption">
                  Officers validate. Systemic problems surface.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-mono font-medium text-primary">
                  3
                </span>
                <p className="text-[13px] text-ink-caption">
                  Teams assemble. Solutions are verified in the field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
