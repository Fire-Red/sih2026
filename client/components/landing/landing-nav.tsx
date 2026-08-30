"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

export function LandingNav() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(Boolean(getSession()?.id));
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-border flex items-center justify-between px-6">
      <Link href="/" className="font-semibold tracking-tight text-ink-strong">
        CivicPulse
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/problems" className="text-[13px] text-ink-caption hover:text-ink-strong">Problems</Link>
        <Link href="/track" className="text-[13px] text-ink-caption hover:text-ink-strong">Tracker</Link>
        <Link href="/engine" className="text-[13px] text-ink-caption hover:text-ink-strong">Engine</Link>
        <Link href="/provenance" className="text-[13px] text-ink-caption hover:text-ink-strong">Provenance</Link>
      </nav>
      <div className="flex items-center gap-4">
        {hasSession ? (
          <Link href="/dashboard" className="text-[13px] font-medium text-primary hover:text-primary/80">
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className="text-[13px] text-ink-caption hover:text-ink-strong">
            Sign in
          </Link>
        )}
        <Link href="/report">
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-white h-8 px-4 text-[13px]">
            Report a problem
          </Button>
        </Link>
      </div>
    </header>
  );
}
