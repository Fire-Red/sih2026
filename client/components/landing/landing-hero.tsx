"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 text-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Civic Platform Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.035em] text-white leading-[1.05]">
          From citizen signal <br />
          to verified systemic impact.
        </h1>

        {/* Clean Subtitle */}
        <p className="mt-6 text-base sm:text-xl font-medium text-white leading-relaxed max-w-2xl">
          The Societal Problem Intelligence Platform. Decompose community challenges into required capabilities, match university teams, and deploy verified field solutions.
        </p>

        {/* Minimal High-Contrast CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/problems">
            <Button className="h-11 px-7 rounded-xl bg-primary hover:bg-primary-deep text-white font-semibold text-sm gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
              Explore Open Problems
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/report">
            <Button
              variant="outline"
              className="h-11 px-6 rounded-xl bg-black/50 hover:bg-black/70 text-white font-semibold text-sm border-white/30 transition-all"
            >
              Report Issue
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
