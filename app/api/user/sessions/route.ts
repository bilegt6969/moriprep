import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await verifyAuthToken(request);
    const body = await request.json();
    const { startTime, endTime, duration, questionsAttempted, domainsStudied } = body;

    if (!startTime || !endTime || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const sessionRef = doc(
      db,
      "userSessions",
      `${authenticatedUserId}_${Date.now()}`,
    );

    await setDoc(sessionRef, {
      userId: authenticatedUserId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration: Number(duration),
      questionsAttempted: Number(questionsAttempted) || 0,
      domainsStudied: domainsStudied || [],
      createdAt: new Date(),
    });

    // Update user's total study time and sessions count
    const userRef = doc(db, "users", authenticatedUserId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        totalStudyTime: (userData.totalStudyTime || 0) + Number(duration),
        sessionsCompleted: (userData.sessionsCompleted || 0) + 1,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error saving session:", error);
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await verifyAuthToken(request);
    const { getDocs, query, where } = await import("firebase/firestore");

    const q = query(
      collection(db, "userSessions"),
      where("userId", "==", authenticatedUserId),
    );
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(sessions);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}
