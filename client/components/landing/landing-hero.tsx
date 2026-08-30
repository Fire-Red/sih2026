import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="bg-white py-24 md:py-32 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-semibold tracking-[-0.04em] text-ink-strong max-w-4xl leading-tight">
        From citizen signal to verified systemic impact
      </h1>
      <p className="mt-6 text-[17px] text-ink-body max-w-2xl mx-auto font-normal">
        The Societal Problem Intelligence Platform. Decompose community challenges into required capabilities, match university teams, and deploy verified field solutions.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link href="/report">
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-white h-11 px-6 text-[15px]">
            Report a problem
          </Button>
        </Link>
        <Link href="/problems">
          <Button variant="outline" className="rounded-full h-11 px-6 text-[15px] border-border text-ink-strong hover:bg-muted bg-white">
            Explore directory
          </Button>
        </Link>
      </div>
    </section>
  );
}
