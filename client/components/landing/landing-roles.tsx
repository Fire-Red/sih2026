import React from "react";
import Link from "next/link";
import { Users, Shield, GraduationCap, Building2, ArrowRight } from "lucide-react";

export function LandingRoles() {
  return (
    <section className="bg-white py-20 px-6 border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium text-neutral-500 mb-1">Ecosystem</p>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-10">Role workspaces</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 flex flex-col justify-between">
            <div>
              <Users className="h-4 w-4 text-neutral-900 mb-3" />
              <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Citizens</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Submit community issues, attach photo evidence, and follow progress.
              </p>
            </div>
            <Link href="/report" className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-neutral-900 hover:underline">
              Submit report <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 flex flex-col justify-between">
            <div>
              <Shield className="h-4 w-4 text-neutral-900 mb-3" />
              <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Government</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Review clustered problem candidates, publish challenges, and award teams.
              </p>
            </div>
            <Link href="/government/manage" className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-neutral-900 hover:underline">
              Open console <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-neutral-900 rounded-xl p-5 flex flex-col justify-between text-white">
            <div>
              <GraduationCap className="h-4 w-4 text-white mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1.5">Students</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Form teams, apply for open problem statements, and build real solutions.
              </p>
            </div>
            <Link href="/problems" className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-white hover:underline">
              Browse problems <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 flex flex-col justify-between">
            <div>
              <Building2 className="h-4 w-4 text-neutral-900 mb-3" />
              <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Institutions</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Register verified research competencies, labs, and faculty mentors.
              </p>
            </div>
            <Link href="/dashboard" className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-neutral-900 hover:underline">
              Portal access <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
