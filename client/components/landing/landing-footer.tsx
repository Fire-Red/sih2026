import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-background py-14 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans font-bold text-xs">
            C
          </div>
          <span className="font-medium text-foreground">
            CivicPulse
          </span>
          <span className="text-muted-foreground">
            · Societal Problem Intelligence Platform
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link href="/report" className="hover:text-primary transition-colors">
            Report issue
          </Link>
          <Link href="/validate" className="hover:text-primary transition-colors">
            Government console
          </Link>
          <Link href="/login" className="hover:text-primary transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
