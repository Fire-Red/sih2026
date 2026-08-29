import React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
} from "lucide-react";

const portals = [
  {
    icon: Users,
    title: "Citizens",
    description:
      "Submit issues in your community, attach evidence, and monitor resolution progress.",
    href: "/report",
    cta: "Submit a report",
    featured: false,
  },
  {
    icon: Shield,
    title: "Government",
    description:
      "Review clustered problem candidates, approve problem profiles, set team quotas, and select winning teams.",
    href: "/government/manage",
    cta: "Open console",
    featured: false,
  },
  {
    icon: GraduationCap,
    title: "Students and researchers",
    description:
      "Discover open problems, form a team, submit your pitch video and deck, and build real solutions for your state.",
    href: "/problems",
    cta: "Apply with a team",
    featured: true,
  },
  {
    icon: Building2,
    title: "Universities and labs",
    description:
      "Register verified faculty and laboratory capabilities, collaborate in consortia, and sponsor challenges.",
    href: "/problems",
    cta: "Institution portal",
    featured: false,
  },
];

export function LandingRoles() {
  return (
    <section id="portals" className="py-20 bg-background px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-[32px] font-light tracking-[-0.03em] text-foreground">
            Stakeholder portals
          </h2>
          <p className="mt-3 text-base text-muted-foreground font-light leading-relaxed">
            Role-specific interfaces for community members, government decision makers, academic teams, and industry partners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.title}
                className={`p-6 rounded-xl border flex flex-col justify-between ${
                  portal.featured
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card border-border"
                }`}
              >
                <div>
                  <Icon
                    className={`h-5 w-5 mb-4 ${
                      portal.featured ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  />
                  <h3
                    className={`text-[15px] font-medium leading-snug ${
                      portal.featured ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {portal.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed font-light ${
                      portal.featured ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {portal.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-current/20">
                  <Link
                    href={portal.href}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      portal.featured
                        ? "text-primary-foreground hover:text-primary-foreground/80"
                        : "text-primary hover:text-primary-deep"
                    }`}
                  >
                    <span>{portal.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

