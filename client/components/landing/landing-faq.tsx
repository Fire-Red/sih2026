import React from "react";

const faqs = [
  { q: "How does the system verify university capabilities?", a: "Every institutional record must link to official accredited directories or verified public portals. Unverified data is clearly flagged." },
  { q: "What is the team quota rule for student challenges?", a: "Each published problem statement allows a maximum of 3 student teams to apply. This guarantees that every submitted pitch receives thorough review." },
  { q: "Does the AI system make autonomous commissioning decisions?", a: "Never. The AI assists with structured capability decomposition, but consequential decisions strictly require review and approval by authorized officials." },
  { q: "How is field impact verified after a project completes?", a: "Every active project workspace logs a pre-intervention baseline, intermediate telemetry, and post-pilot metrics with documentary proof." },
];

export function LandingFaq() {
  return (
    <section className="bg-white py-20 px-6 border-b border-neutral-200/80">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium text-neutral-500 mb-1 text-center">Support</p>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-8 text-center">Frequently asked questions</h2>
        <div className="divide-y divide-neutral-200/80 border-t border-neutral-200/80">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-neutral-900 list-none">
                {faq.q}
                <span className="text-neutral-400 group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
