import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Citizen reporting",
    description:
      "Citizens submit local issues with descriptions, categories, and optional photos or documents.",
    link: "/report",
    linkText: "Submit report",
  },
  {
    number: "02",
    title: "Problem clustering & validation",
    description:
      "The system groups related reports across locations and domains for government review and formal problem definition.",
    link: "/validate",
    linkText: "View console",
  },
  {
    number: "03",
    title: "Capability assembly",
    description:
      "Identifies required technical capabilities and matches them across universities, research departments, and industry partners.",
    link: "/login",
    linkText: "Explore partners",
  },
  {
    number: "04",
    title: "Project execution & impact",
    description:
      "Teams submit proposals, implement prototypes, run field pilots, and record verified baseline and outcome measurements.",
    link: "/login",
    linkText: "Track projects",
  },
];

export function LandingPipeline() {
  return (
    <section id="how-it-works" className="py-20 bg-surface-soft px-6 border-t border-b border-border-soft">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-foreground">
            How the platform works
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            A continuous workflow from initial community feedback to verified field implementation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-card border border-border-soft flex flex-col justify-between"
            >
              <div>
                <span className="text-xl font-mono text-primary font-medium block mb-4">
                  {step.number}
                </span>
                <h3 className="text-lg font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-soft">
                <Link
                  href={step.link}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-[#003ecc] transition-colors"
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
