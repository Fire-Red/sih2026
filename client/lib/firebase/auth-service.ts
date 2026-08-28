import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./config";
import { setSession, clearSession } from "@/lib/auth/session";
import { UserRole, UserSession } from "@/types/auth";

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

  // Retrieve existing stored role if available or default to citizen
  const session: UserSession = {
    id: user.uid,
    name: user.displayName || email.split("@")[0],
    email: user.email || email,
    role: "citizen",
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

  const session: UserSession = {
    id: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "User",
    email: user.email || "",
    role: "citizen",
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
