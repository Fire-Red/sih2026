"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  FileText,
  Gavel,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  UserRound,
  X,
  GraduationCap,
  Building2,
  FolderKanban,
} from "lucide-react";
import { logout } from "@/lib/firebase/auth-service";
import { Button } from "@/components/ui/button";
import type { UserRole, UserSession } from "@/types/auth";

interface SidebarProps {
  session: UserSession | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Review console",
    href: "/government/manage",
    icon: Gavel,
    roles: ["government", "admin"],
  },
  {
    label: "Report issue",
    href: "/report",
    icon: FileText,
    roles: ["citizen"],
  },
  {
    label: "My activity",
    href: "/activity",
    icon: Activity,
    roles: ["citizen"],
  },
  {
    label: "Teams",
    href: "/teams",
    icon: GraduationCap,
    roles: ["student"],
  },
  {
    label: "Capabilities",
    href: "/capabilities",
    icon: Building2,
    roles: ["institution"],
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    roles: ["government", "admin", "student"],
  },
  { label: "Problem directory", href: "/problems", icon: Network },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    citizen: "Citizen",
    student: "Student",
    government: "Officer",
    institution: "Institution",
    admin: "Admin",
  };
  return labels[role] ?? "User";
}

export function DashboardSidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = session?.role ?? "citizen";

  const items = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const initials = session?.name ? getInitials(session.name) : "U";

  if (role === "citizen") {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="shrink-0 text-sm font-semibold tracking-tight text-foreground"
          >
            CivicPulse
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2"
          >
            {[
              { label: "Home", href: "/dashboard" },
              { label: "Report a problem", href: "/report" },
              { label: "Track reports", href: "/track" },
              { label: "Explore problems", href: "/problems" },
            ].map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 border-l border-border pl-4">
            <Link
              href="/profile"
              aria-label="Open profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {initials}
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Sign out"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-14 items-center px-5 border-b border-neutral-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900 focus-visible:outline-none"
        >
          <span>CivicPulse</span>
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-xs transition-colors ${
                active
                  ? "bg-neutral-100 font-medium text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-neutral-500 group-hover:text-neutral-900" strokeWidth={1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-100 p-3 space-y-1">
        <Link
          href="/profile"
          className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          <UserRound className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span>Settings</span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2.5 px-2.5 text-xs text-neutral-500 hover:text-neutral-900 h-8 rounded-lg"
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span>Sign out</span>
        </Button>

        <div className="flex items-center gap-2.5 px-2.5 pt-2 border-t border-neutral-100/80">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-medium text-neutral-700">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-neutral-900">
              {session?.name || "User"}
            </p>
            <p className="truncate text-[11px] text-neutral-400">
              {getRoleLabel(role)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 border-r border-neutral-200/80 bg-white lg:block">
        {sidebarContent}
      </aside>

      <div className="flex h-12 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight text-neutral-900">
          CivicPulse
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-200 bg-white shadow-xl lg:hidden">
            {sidebarContent}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </aside>
        </>
      )}
    </>
  );
}
