import { UserSession } from "@/types/auth";

const SESSION_KEY = "civicpulse_session";

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as UserSession;
    if (!parsed || !parsed.id || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function requireSession(): UserSession | null {
  const session = getSession();
  if (!session || !session.id) {
    return null;
  }
  return session;
}

export function setSession(session: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
