import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
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
    const { questionId, answer, isCorrect, timeSpent, question } = body;

    // Validate required fields
    if (!questionId || answer === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Sanitize and validate data
    const sanitizedAnswer = String(answer).trim();
    const sanitizedTimeSpent = Number(timeSpent) || 0;

    // Create progress document with server-controlled userId
    const progressRef = doc(
      db,
      "userProgress",
      `${authenticatedUserId}_${questionId}`,
    );
    const docSnap = await getDoc(progressRef);
    const isFirstAttempt = !docSnap.exists();

    const newAttempt = {
      answer: sanitizedAnswer,
      isCorrect: Boolean(isCorrect),
      timeSpent: sanitizedTimeSpent,
      attemptedAt: new Date(),
    };

    const baseData: any = {
      userId: authenticatedUserId, // Server-enforced ownership
      questionId,
      attempts: [newAttempt],
      lastAttemptedAt: new Date().toISOString(),
    };

    // Add domain and skill information if question is provided
    if (question) {
      if (question.domain) baseData.domain = question.domain;
      if (question.skill) baseData.skill = question.skill;
    }

    if (docSnap.exists()) {
      // Add new attempt to existing array
      await updateDoc(progressRef, {
        attempts: arrayUnion(newAttempt),
        lastAttemptedAt: new Date().toISOString(),
      });

      // Update domain and skill if they weren't set before
      if (question) {
        const existingData = docSnap.data();
        if (!existingData.domain || !existingData.skill) {
          await updateDoc(progressRef, {
            domain: question.domain || null,
            skill: question.skill || null,
          });
        }
      }
    } else {
      // Create new document with first attempt
      await setDoc(progressRef, baseData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error saving user progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
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

    // Query only the authenticated user's progress
    const q = query(
      collection(db, "userProgress"),
      where("userId", "==", authenticatedUserId),
    );
    const querySnapshot = await getDocs(q);
    const userProgress = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(userProgress);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
