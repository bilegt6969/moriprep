import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Verify Firebase ID token from Authorization header
 * Returns the authenticated user ID, or throws an error
 */
export async function verifyAuthToken(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const idToken = authHeader.substring(7);

  try {
    // Initialize Firebase Admin if not already initialized
    if (getApps().length === 0) {
      initializeApp({
        credential: {
          getAccessToken: async () => {
            // Placeholder - will use environment variables in production
            return "" as any;
          },
        },
      });
    }
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (authError: any) {
    if (
      authError.code === "auth/id-token-expired" ||
      authError.code === "auth/id-token-revoked" ||
      authError.code === "auth/invalid-id-token"
    ) {
      throw new Error("Unauthorized");
    }
    throw authError;
  }
}

/**
 * Helper to handle authentication errors consistently
 */
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.error("Authentication error:", error);
  return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
}
