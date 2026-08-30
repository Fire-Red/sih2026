"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gavel,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/firebase/auth-service";
import { Button } from "@/components/ui/button";
import { UserRole, UserSession } from "@/types/auth";

interface DashboardSidebarProps {
  session: UserSession | null;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
}

const navigation: NavigationItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Problems", href: "/problems", icon: Network },
  { label: "Report an issue", href: "/report", icon: FileText },
  { label: "Review proposals", href: "/government/manage", icon: Gavel, roles: ["government"] },
  { label: "Activity", href: "/track", icon: Activity, roles: ["citizen"] },
];

const panelTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

export function DashboardSidebar({ session }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = session?.role ?? "citizen";
  const items = navigation.filter(
    (item) => !item.roles || item.roles.includes(role)
  );
  const transition = reduceMotion
    ? { type: "tween" as const, duration: 0 }
    : panelTransition;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "/") {
        event.preventDefault();
        setExpanded((current) => !current);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const content = (showLabels: boolean) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-3">
        <Link
          href="/dashboard"
          aria-label="Go to overview"
          className="flex min-w-0 items-center gap-3 rounded-lg px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            C
          </span>
          {showLabels && (
            <span className="truncate text-base font-medium tracking-[-0.02em] text-foreground">
              CivicPulse
            </span>
          )}
        </Link>
      </div>

      <nav aria-label="Workspace navigation" className="flex-1 px-3 py-5">
        <p
          className={`mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground ${
            showLabels ? "" : "sr-only"
          }`}
        >
          Workspace
        </p>
        <div className="space-y-1">
          {items.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                title={showLabels ? undefined : item.label}
                className={`group flex min-h-10 items-center gap-3 rounded-lg px-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${showLabels ? "" : "justify-center"}`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                {showLabels && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="space-y-2 border-t border-border px-3 py-4">
        <Link
          href="/profile"
          title={showLabels ? undefined : "Profile"}
          className={`flex min-h-10 items-center gap-3 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            showLabels ? "" : "justify-center"
          }`}
        >
          <UserRound className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          {showLabels && <span>Profile</span>}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          title={showLabels ? undefined : "Sign out"}
          className={`w-full justify-start gap-3 px-2.5 text-muted-foreground hover:text-foreground ${
            showLabels ? "" : "justify-center"
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          {showLabels && <span>Sign out</span>}
        </Button>
        <div
          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${
            showLabels ? "" : "justify-center"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-foreground">
            {initials}
          </span>
          {showLabels && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">
                {session?.name || "Civic User"}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {session?.email || ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed left-0 top-0 z-40 hidden h-screen w-16 border-r border-border bg-background lg:block">
        {content(false)}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={transition}
              className="absolute left-0 top-0 h-full w-64 border-r border-border bg-background shadow-xl shadow-foreground/5"
            >
              {content(true)}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Collapse sidebar"
                aria-expanded={expanded}
                onClick={() => setExpanded(false)}
                className="absolute -right-4 top-5 h-8 w-8 rounded-full bg-background shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.aside>
          )}
        </AnimatePresence>
        {!expanded && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Expand sidebar"
            aria-expanded={expanded}
            onClick={() => setExpanded(true)}
            className="absolute -right-4 top-5 h-8 w-8 rounded-full bg-background shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            C
          </span>
          <span className="text-sm font-medium text-foreground">CivicPulse</span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={transition}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background shadow-2xl lg:hidden"
            >
              {content(true)}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close sidebar"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
