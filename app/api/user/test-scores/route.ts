import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
    const { testType, score, date, sectionScores, notes } = body;

    if (!testType || score === undefined || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const userRef = doc(db, "users", authenticatedUserId);
    const userDoc = await getDoc(userRef);

    const testScoreEntry = {
      id: `${Date.now()}`,
      testType,
      score: Number(score),
      date: new Date(date).toISOString(),
      sectionScores: sectionScores || null,
      notes: notes || null,
      createdAt: new Date().toISOString(),
    };

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const previousScores = userData.previousScores || [];

      await updateDoc(userRef, {
        previousScores: arrayUnion(testScoreEntry),
      });
    } else {
      await setDoc(userRef, {
        userId: authenticatedUserId,
        previousScores: [testScoreEntry],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error saving test score:", error);
    return NextResponse.json(
      { error: "Failed to save test score" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await verifyAuthToken(request);
    const { searchParams } = new URL(request.url);
    const scoreId = searchParams.get("scoreId");

    if (!scoreId) {
      return NextResponse.json(
        { error: "Missing scoreId" },
        { status: 400 },
      );
    }

    const userRef = doc(db, "users", authenticatedUserId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const previousScores = userData.previousScores || [];
      const updatedScores = previousScores.filter((s: any) => s.id !== scoreId);

      await updateDoc(userRef, { previousScores: updatedScores });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error deleting test score:", error);
    return NextResponse.json(
      { error: "Failed to delete test score" },
      { status: 500 },
    );
  }
}
