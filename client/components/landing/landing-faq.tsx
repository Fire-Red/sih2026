"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How does the system ensure university capabilities are real?",
    answer: "Every institutional department, laboratory, and research center record must link to official accredited directories or verified public portals. Unverified or self reported data is clearly flagged with a verification status badge.",
  },
  {
    question: "What is the team quota rule for student challenges?",
    answer: "Each published problem statement allows a maximum of 3 student teams to apply. This prevents evaluation backlogs and guarantees that every submitted pitch video and slide deck receives thorough government review.",
  },
  {
    question: "Does the AI backend approve government commissioning decisions automatically?",
    answer: "Never. The MistralAI backend assists with structured capability decomposition, semantic clustering, and explanation generation. Consequential commissioning decisions and grant allocations strictly require manual human review by authorized officers.",
  },
  {
    question: "How is field impact verified after a project completes?",
    answer: "Every active project workspace logs a pre intervention baseline measurement, intermediate prototype telemetry, and post pilot field metrics with photo/documentary proof before final completion.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-background px-6 border-b border-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary font-semibold uppercase tracking-wider mb-2">
            Governance & FAQs
          </div>
          <h2 className="text-3xl font-light tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-light">
            Standards, verification principles, and platform lifecycle.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.question} className="py-5">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-[15px] font-medium text-foreground group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
