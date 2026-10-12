import { verifyIdToken } from "@/lib/auth/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify Firebase Admin is configured
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    // Authenticate the request
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.substring(7);

    const decodedToken = await verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authenticatedUserId = decodedToken.uid;

    // Query only the authenticated user's answers
    const q = query(
      collection(db, "userAnswers"),
      where("userId", "==", authenticatedUserId),
    );
    const querySnapshot = await getDocs(q);
    const userAnswers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(userAnswers);
  } catch (error) {
    console.error("Error fetching user answers:", error);
    return NextResponse.json(
      { error: "Failed to fetch answers" },
      { status: 500 },
    );
  }
}
