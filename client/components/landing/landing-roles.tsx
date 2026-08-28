import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const portals = [
  {
    title: "Citizens",
    description: "Submit issues in your community, attach evidence, and monitor resolution progress.",
    href: "/report",
    cta: "Submit a report",
  },
  {
    title: "Government",
    description: "Review clustered problem candidates, approve problem profiles, and publish state challenges.",
    href: "/validate",
    cta: "Open console",
  },
  {
    title: "Universities & Labs",
    description: "Register verified faculty and laboratory capabilities, collaborate in consortia, and bid on challenges.",
    href: "/login",
    cta: "Institution portal",
  },
  {
    title: "Students & Researchers",
    description: "Discover challenges matching your technical skills, build cross-campus teams, and implement projects.",
    href: "/login",
    cta: "Student portal",
  },
  {
    title: "Industry & Startups",
    description: "Provide co-funding, deploy existing technology components, and scale verified prototypes.",
    href: "/login",
    cta: "Partner portal",
  },
  {
    title: "Administrators",
    description: "Manage system access, oversee directory records, and audit platform data provenance.",
    href: "/login",
    cta: "Admin console",
  },
];

export function LandingRoles() {
  return (
    <section id="portals" className="py-20 bg-background px-6 border-b border-border-soft">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-foreground">
            Stakeholder portals
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Role specific interfaces designed for community members, government decision makers, academic researchers, and industry partners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface-soft border border-border-soft flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {portal.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-soft">
                <Link
                  href={portal.href}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-[#003ecc] transition-colors"
                >
                  <span>{portal.cta}</span>
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
