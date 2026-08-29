import React from "react";
import Link from "next/link";

export function AuthSideHero() {
  return (
    <div className="hidden lg:flex flex-col justify-center p-10 xl:p-14 h-full">
      <div className="space-y-4 max-w-md">
        <Link href="/" className="inline-flex items-center gap-3 group mb-8">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
            C
          </div>
          <span className="text-xl font-medium tracking-tight text-foreground">
            CivicPulse
          </span>
        </Link>

        <h2 className="text-3xl xl:text-4xl font-normal tracking-[-0.035em] text-foreground leading-[1.15]">
          Turning community signals into verified systemic solutions.
        </h2>

        <p className="text-base text-muted-foreground leading-relaxed">
          A structured civic intelligence pipeline connecting citizens, universities, and institutions.
        </p>
      </div>
    </div>
  );
}
