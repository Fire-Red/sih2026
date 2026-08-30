import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class AuthorizationError extends Error {
  constructor(public readonly status: 401 | 403 | 503, message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export interface AuthenticatedUser {
  id: string;
  role: "citizen" | "government" | "institution" | "student" | "industry" | "admin";
}

function getFirebaseAdminAuth() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new AuthorizationError(503, "Server authentication is not configured.");
  }

  const app = getApps()[0] ?? initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return getAuth(app);
}

function readBearerToken(request: Request): string {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new AuthorizationError(401, "Authentication is required.");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) {
    throw new AuthorizationError(401, "Authentication is required.");
  }

  return token;
}

export async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const token = readBearerToken(request);
  let firebaseUid: string;

  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(token);
    firebaseUid = decodedToken.uid;
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) throw error;
    throw new AuthorizationError(401, "Authentication could not be verified.");
  }

  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.firebaseUid, firebaseUid))
    .limit(1);

  if (!user) {
    throw new AuthorizationError(403, "Your account is not enabled for this workspace.");
  }

  const normalizedRole = user.role === "industry" ? "citizen" : user.role;
  return { id: user.id, role: normalizedRole };
}

export async function requireGovernmentUser(request: Request): Promise<string> {
  const user = await requireAuthenticatedUser(request);

  if (user.role !== "government") {
    throw new AuthorizationError(403, "Government access is required.");
  }

  return user.id;
}
