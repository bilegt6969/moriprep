import { verifyIdToken } from "@/lib/auth/server";
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

  const decodedToken = await verifyIdToken(idToken);
  if (!decodedToken) {
    throw new Error("Unauthorized");
  }
  return decodedToken.uid;
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
