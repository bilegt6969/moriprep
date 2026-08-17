import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import {
    AUTH_SESSION_COOKIE,
    GUEST_ID_COOKIE,
    secureCookieOptions,
} from "lib/auth/cookies";
import { cookies } from "next/headers";

export function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    ) as {
      project_id?: string;
      client_email: string;
      private_key: string;
    };

    return initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id ?? projectId,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
    });
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY.",
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export async function verifyIdToken(
  idToken: string,
): Promise<DecodedIdToken | null> {
  try {
    getAdminApp();
    return await getAuth().verifyIdToken(idToken);
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifyIdToken(token);
}

export async function requireAuthenticatedUser(): Promise<DecodedIdToken> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export function isAdminUid(uid: string): boolean {
  const admins =
    process.env.ADMIN_FIREBASE_UIDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];
  return admins.includes(uid);
}

export async function requireAdmin(): Promise<DecodedIdToken> {
  const user = await requireAuthenticatedUser();
  if (!isAdminUid(user.uid)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function getOrderUserId(): Promise<string> {
  const authUser = await getAuthenticatedUser();
  if (authUser) {
    return authUser.uid;
  }

  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_ID_COOKIE)?.value;

  if (!guestId) {
    guestId = `guest_${crypto.randomUUID()}`;
    cookieStore.set(
      GUEST_ID_COOKIE,
      guestId,
      secureCookieOptions({ maxAge: 60 * 60 * 24 * 365 }),
    );
  }

  return guestId;
}

export async function setAuthSessionCookie(idToken: string): Promise<boolean> {
  const decoded = await verifyIdToken(idToken);
  if (!decoded) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_SESSION_COOKIE,
    idToken,
    secureCookieOptions({ maxAge: 60 * 60 }),
  );
  return true;
}

export async function clearAuthSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE);
}
