import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-background/90 backdrop-blur-md border-b border-border-soft">
      <div className="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Minimal Wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans font-semibold text-sm">
            C
          </div>
          <span className="text-lg font-medium tracking-tight text-foreground">
            CivicPulse
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-normal text-muted-foreground">
          <Link href="#how-it-works" className="hover:text-primary transition-colors">
            How it works
          </Link>
          <Link href="#portals" className="hover:text-primary transition-colors">
            Portals
          </Link>
          <Link href="#data-model" className="hover:text-primary transition-colors">
            Data model
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link href="/report">
            <Button className="h-9 px-4 rounded-full bg-primary text-primary-foreground hover:bg-[#003ecc] font-medium text-xs shadow-xs">
              <span>Report an issue</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
