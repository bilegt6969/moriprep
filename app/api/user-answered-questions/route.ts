import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
    const { answeredQuestions } = body;

    // Validate required fields
    if (!answeredQuestions || typeof answeredQuestions !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid answeredQuestions" },
        { status: 400 },
      );
    }

    // Convert Map-like object to plain object
    const answeredQuestionsObj = Object.fromEntries(
      Object.entries(answeredQuestions),
    );

    const answeredRef = doc(db, "userAnsweredQuestions", authenticatedUserId);
    await setDoc(answeredRef, {
      userId: authenticatedUserId, // Server-enforced ownership
      answeredQuestions: answeredQuestionsObj,
      lastUpdated: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error saving answered questions:", error);
    return NextResponse.json(
      { error: "Failed to save answered questions" },
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

    // Get only the authenticated user's answered questions
    const answeredRef = doc(db, "userAnsweredQuestions", authenticatedUserId);
    const docSnap = await getDoc(answeredRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as {
        answeredQuestions: Record<
          string,
          { isCorrect: boolean; answer: string }
        >;
      };
      return NextResponse.json(data.answeredQuestions);
    }

    return NextResponse.json({});
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error fetching answered questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch answered questions" },
      { status: 500 },
    );
  }
}
