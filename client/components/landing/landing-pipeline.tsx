import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Citizen reporting",
    description:
      "Citizens submit local issues with location, category, severity, and optional photo evidence.",
    link: "/report",
    linkText: "Submit a report",
  },
  {
    number: "02",
    title: "Problem clustering and validation",
    description:
      "Related reports group into candidate systemic problems across locations. Government officials review and formally validate each one.",
    link: "/validate",
    linkText: "View validation console",
  },
  {
    number: "03",
    title: "Published problem directory",
    description:
      "Validated problems publish to the open directory with a team quota. Citizens and students can see exactly what is being solved.",
    link: "/problems",
    linkText: "Browse problems",
  },
  {
    number: "04",
    title: "Student team application",
    description:
      "Student teams apply with a one-paragraph approach, a three-minute video walkthrough, and a presentation deck.",
    link: "/problems",
    linkText: "Apply with a team",
  },
  {
    number: "05",
    title: "Project execution and impact",
    description:
      "Government selects a winning team. An active project workspace opens with milestones, a pilot phase, and verified outcome tracking.",
    link: "/login",
    linkText: "Track projects",
  },
];

export function LandingPipeline() {
  return (
    <section id="how-it-works" className="py-20 bg-muted px-6 border-t border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-[32px] font-light tracking-[-0.03em] text-foreground">
            How the platform works
          </h2>
          <p className="mt-3 text-base text-muted-foreground font-light leading-relaxed">
            A continuous workflow from community signal to verified field deployment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-xl bg-card border border-border flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-medium text-primary tnum block mb-4">
                  {step.number}
                </span>
                <h3 className="text-[15px] font-medium text-foreground leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  href={step.link}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-deep transition-colors"
                >
                  <span>{step.linkText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

