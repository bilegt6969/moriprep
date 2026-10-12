import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify Firebase Admin is configured
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    // Authenticate the request
    const authenticatedUserId = await verifyAuthToken(request);

    // Parse request body
    const body = await request.json();
    const { isCorrect, timeSpent } = body;

    // Validate required fields
    if (isCorrect === undefined || timeSpent === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Sanitize and validate data
    const sanitizedIsCorrect = Boolean(isCorrect);
    const sanitizedTimeSpent = Number(timeSpent) || 0;

    const statsRef = doc(db, "userStats", authenticatedUserId);
    const docSnap = await getDoc(statsRef);

    if (docSnap.exists()) {
      const stats = docSnap.data() as any;
      const newTotal = stats.totalQuestions + 1;
      const newAttempts = stats.totalAttempts + 1;
      const newCorrect = stats.correctAnswers + (sanitizedIsCorrect ? 1 : 0);
      const newAverageTime =
        (stats.averageTime * stats.totalQuestions + sanitizedTimeSpent) /
        newTotal;

      await updateDoc(statsRef, {
        totalQuestions: newTotal,
        totalAttempts: newAttempts,
        correctAnswers: newCorrect,
        averageTime: newAverageTime,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      await setDoc(statsRef, {
        userId: authenticatedUserId, // Server-enforced ownership
        totalQuestions: 1,
        totalAttempts: 1,
        correctAnswers: sanitizedIsCorrect ? 1 : 0,
        averageTime: sanitizedTimeSpent,
        weakDomains: [],
        strongDomains: [],
        lastUpdated: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 },
    );
  }
}

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
    const authenticatedUserId = await verifyAuthToken(request);

    // Get only the authenticated user's stats
    const docRef = doc(db, "userStats", authenticatedUserId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    }

    return NextResponse.json(null);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
