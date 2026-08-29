import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./config";
import { setSession, clearSession, getSession } from "@/lib/auth/session";
import { UserSession } from "@/types/auth";

export async function registerWithEmail(
  name: string,
  email: string,
  pass: string
): Promise<UserSession> {
  if (!auth) throw new Error("Firebase auth is not initialized");

  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });
  const token = await user.getIdToken();

  const session: UserSession = {
    id: user.uid,
    name: name || email.split("@")[0],
    email: user.email || email,
    role: "citizen",
    token,
  };

  setSession(session);
  return session;
}

export async function loginWithEmail(
  email: string,
  pass: string
): Promise<UserSession> {
  if (!auth) throw new Error("Firebase auth is not initialized");

  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  const token = await user.getIdToken();

  // Load existing session role if already stored, fallback to citizen
  const existingSession = getSession();
  const preservedRole =
    existingSession && existingSession.id === user.uid
      ? existingSession.role
      : "citizen";

  const session: UserSession = {
    id: user.uid,
    name: user.displayName || email.split("@")[0],
    email: user.email || email,
    role: preservedRole,
    token,
  };

  setSession(session);
  return session;
}

export async function loginWithGoogle(): Promise<UserSession> {
  if (!auth) throw new Error("Firebase auth is not initialized");

  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  const token = await user.getIdToken();

  // Load existing session role if already stored, fallback to citizen
  const existingSession = getSession();
  const preservedRole =
    existingSession && existingSession.id === user.uid
      ? existingSession.role
      : "citizen";

  const session: UserSession = {
    id: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "User",
    email: user.email || "",
    role: preservedRole,
    token,
  };

  setSession(session);
  return session;
}

export async function logout(): Promise<void> {
  if (auth) {
    await firebaseSignOut(auth);
  }
  clearSession();
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error("Firebase auth is not initialized");
  await sendPasswordResetEmail(auth, email);
}
