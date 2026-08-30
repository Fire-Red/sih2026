import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200/80 py-16 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div>
          <span className="text-sm font-semibold tracking-tight text-neutral-900 block mb-2">
            CivicPulse
          </span>
          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
            Societal problem intelligence & collaboration platform. Turn community signals into verified systemic impact.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2.5">
            <p className="font-medium text-neutral-900">Platform</p>
            <div className="flex flex-col gap-2 text-neutral-500">
              <Link href="/problems" className="hover:text-neutral-900">Directory</Link>
              <Link href="/track" className="hover:text-neutral-900">Tracker</Link>
              <Link href="/report" className="hover:text-neutral-900">Report issue</Link>
            </div>
          </div>
          <div className="space-y-2.5">
            <p className="font-medium text-neutral-900">Portals</p>
            <div className="flex flex-col gap-2 text-neutral-500">
              <Link href="/government/manage" className="hover:text-neutral-900">Government</Link>
              <Link href="/dashboard" className="hover:text-neutral-900">Students</Link>
              <Link href="/dashboard" className="hover:text-neutral-900">Institutions</Link>
            </div>
          </div>
          <div className="space-y-2.5">
            <p className="font-medium text-neutral-900">System</p>
            <div className="flex flex-col gap-2 text-neutral-500">
              <Link href="/login" className="hover:text-neutral-900">Sign in</Link>
              <Link href="/register" className="hover:text-neutral-900">Create account</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-neutral-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-400">
        <p>© {new Date().getFullYear()} CivicPulse. All rights reserved.</p>
        <p>100% data provenance guaranteed.</p>
      </div>
    </footer>
  );
}
