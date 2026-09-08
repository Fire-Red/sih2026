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
  document.cookie = "civicpulse_auth=1; path=/; max-age=2592000; SameSite=Lax";
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  document.cookie = "civicpulse_auth=; path=/; max-age=0; SameSite=Lax";
}

export async function getValidAuthToken(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined;
  try {
    const { auth } = await import("@/lib/firebase/config");
    if (auth?.currentUser) {
      const token = await auth.currentUser.getIdToken();
      const currentSession = getSession();
      if (currentSession && currentSession.token !== token) {
        setSession({ ...currentSession, token });
      }
      return token;
    }
  } catch {
    // Fall back to stored session token
  }
  return getSession()?.token;
}

