"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/firebase/auth-service";
import { UserSession } from "@/types/auth";
import { LogOut, Bell, Search, LayoutDashboard, Compass, Layers, ShieldCheck } from "lucide-react";

interface DashboardNavProps {
  session: UserSession | null;
}

export function DashboardNav({ session }: DashboardNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "government":
        return "Government Console";
      case "student":
        return "Student Innovator Hub";
      case "institution":
        return "University / Lab Portal";
      case "industry":
        return "Industry CSR Hub";
      case "citizen":
      default:
        return "Citizen Portal";
    }
  };

  return (
    <header className="h-16 border-b border-border-soft bg-background sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-5 h-5 rounded-full bg-primary inline-block" />
          <span className="font-medium text-base tracking-[-0.02em] text-foreground">
            CivicPulse
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1.5 pl-6 border-l border-border-soft">
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-soft border border-border-soft font-medium text-foreground">
            {getRoleLabel(session?.role)}
          </span>
          <span className="text-xs text-muted-foreground">All-India Network</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-border-soft">
          <div className="w-8 h-8 rounded-full bg-surface-soft border border-border-soft flex items-center justify-center text-xs font-medium text-foreground">
            {session?.name ? session.name.substring(0, 2).toUpperCase() : "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-foreground leading-tight truncate max-w-[140px]">
              {session?.name || "Civic User"}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight truncate max-w-[140px]">
              {session?.email || "user@civicpulse.gov.in"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 rounded-full hover:bg-surface-soft text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
