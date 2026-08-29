import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-foreground text-background py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 pb-12 border-b border-background/10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                C
              </div>
              <span className="text-sm font-medium text-background">CivicPulse</span>
            </div>
            <p className="text-xs text-background/50 leading-relaxed font-light max-w-[200px]">
              A shared place for reporting, reviewing, and solving local problems.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-background/40 uppercase tracking-widest mb-4">
              Platform
            </p>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li>
                <Link href="/problems" className="hover:text-background transition-colors">
                  Open problems
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-background transition-colors">
                  Report an issue
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-background transition-colors">
                  Live tracker
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-background transition-colors">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-background/40 uppercase tracking-widest mb-4">
              Portals
            </p>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li>
                <Link href="/login" className="hover:text-background transition-colors">
                  Student portal
                </Link>
              </li>
              <li>
                <Link href="/validate" className="hover:text-background transition-colors">
                  Government console
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-background transition-colors">
                  Institution portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-background transition-colors">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-background/30 font-light">
          <span>CivicPulse · Community intelligence</span>
          <span>Data sourced from official government and accredited institutional directories only.</span>
        </div>
      </div>
    </footer>
  );
}
