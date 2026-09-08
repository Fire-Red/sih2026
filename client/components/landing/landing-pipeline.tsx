import React from "react";

const steps = [
  { num: "01", title: "Citizen report", desc: "Citizens submit local issues with location, topic context, and verifiable photo evidence." },
  { num: "02", title: "Problem fusion", desc: "Similar reports are clustered by domain, spatial radius, and timeline." },
  { num: "03", title: "Open challenges", desc: "Validated problems publish to the open directory with fixed team quotas." },
  { num: "04", title: "Student pitches", desc: "Multidisciplinary student teams submit approach briefs and walkthrough decks." },
  { num: "05", title: "Field execution", desc: "Government commissions the winning team into an active milestone workspace." },
];

export function LandingPipeline() {
  return (
    <section className="bg-white py-20 px-6 border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium text-neutral-500 mb-1">Process</p>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-12">Intelligence pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-white">
              <span className="text-xs font-mono text-neutral-400 mb-2 block">{s.num}</span>
              <h3 className="text-sm font-medium text-neutral-900 mb-1.5">{s.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
