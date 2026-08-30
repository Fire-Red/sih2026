"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/use-user-store";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FlaskConical, 
  GraduationCap, 
  Layers, 
  Plus, 
  Award,
  Sparkles
} from "lucide-react";

export function InstitutionDashboardView() {
  const user = useUserStore((state) => state.user);
  const [teamsCount, setTeamsCount] = useState(0);
  const [capabilitiesCount, setCapabilitiesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInstitutionData() {
      try {
        const res = await fetch("/api/teams");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.teams) {
            setTeamsCount(data.teams.length);
          }
        }
        const roleProfile = user?.roleProfile;
        if (roleProfile && "capabilities" in roleProfile && Array.isArray(roleProfile.capabilities)) {
          setCapabilitiesCount(roleProfile.capabilities.length);
        } else if (roleProfile && "departments" in roleProfile && Array.isArray(roleProfile.departments)) {
          setCapabilitiesCount(roleProfile.departments.length);
        } else {
          setCapabilitiesCount(0);
        }
      } catch {
        // Honest data handling
      } finally {
        setLoading(false);
      }
    }
    void loadInstitutionData();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary">University & Lab Portal</span>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {user?.displayName || "Academic Institution"} Console
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Profile research capabilities, showcase verified labs, and mentor affiliated student teams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/problems">
              <Layers className="mr-2 h-4 w-4" />
              Browse Challenges
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/profile">
              <Plus className="mr-2 h-4 w-4" />
              Update Capabilities
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Affiliated Teams</span>
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-mono text-2xl font-medium text-foreground">
            {loading ? "..." : teamsCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Student teams formed within your institution</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Research Labs & Facilities</span>
            <FlaskConical className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-mono text-2xl font-medium text-foreground">
            {loading ? "..." : capabilitiesCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Registered specialized facilities with provenance</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Accreditation Status</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 font-mono text-base font-medium text-foreground">
            Verified Partner
          </p>
          <p className="mt-1 text-xs text-muted-foreground">State and national higher education registry</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-medium text-foreground">Institutional Capability Assembly</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          When societal challenges are published by government departments, the deterministic capability matching engine pairs required skills with registered university labs and student departments.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="mt-2 text-sm font-medium text-foreground">Department Roster</h3>
            <p className="mt-1 text-xs text-muted-foreground">Keep your faculty lists and department specializations up to date.</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h3 className="mt-2 text-sm font-medium text-foreground">Testing & Pilot Labs</h3>
            <p className="mt-1 text-xs text-muted-foreground">Offer hardware, wet labs, or IoT testing setups for student deployments.</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="mt-2 text-sm font-medium text-foreground">Inter-College Consortia</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pair multi-institutional expertise for high complexity systemic problems.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
