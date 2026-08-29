import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-4xl h-14 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-5 flex items-center justify-between pointer-events-auto transition-all">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center font-semibold text-xs shadow-sm shadow-primary/30 group-hover:scale-105 transition-transform">
            CP
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            CivicPulse
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-muted-foreground">
          <Link href="/problems" className="hover:text-foreground transition-colors">
            Problems
          </Link>
          <Link href="/track" className="hover:text-foreground transition-colors">
            Live Tracker
          </Link>
          <Link href="/#pipeline" className="hover:text-foreground transition-colors">
            Intelligence Engine
          </Link>
          <Link href="/#provenance" className="hover:text-foreground transition-colors">
            Data Provenance
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link href="/report">
            <Button size="sm" className="h-8 px-4 rounded-full bg-primary hover:bg-primary-deep text-white font-medium text-xs shadow-sm shadow-primary/25">
              Report Issue
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
