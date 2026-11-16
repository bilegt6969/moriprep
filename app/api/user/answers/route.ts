import { verifyIdToken } from "@/lib/auth/server";
import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

async function getAuthenticatedUserId(
  request: NextRequest,
): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const decodedToken = await verifyIdToken(authHeader.substring(7));
  return decodedToken?.uid ?? null;
}

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await getAuthenticatedUserId(request);
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const q = query(
      collection(db, "userAnswers"),
      where("userId", "==", authenticatedUserId),
    );
    const querySnapshot = await getDocs(q);
    const userAnswers = querySnapshot.docs.map((answerDoc) => ({
      id: answerDoc.id,
      ...answerDoc.data(),
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

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await getAuthenticatedUserId(request);
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, domain, category, isCorrect } = body;

    if (
      typeof questionId !== "string" ||
      typeof domain !== "string" ||
      typeof category !== "string" ||
      typeof isCorrect !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid answer fields" },
        { status: 400 },
      );
    }

    await addDoc(collection(db, "userAnswers"), {
      userId: authenticatedUserId,
      questionId,
      domain,
      category,
      isCorrect,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving user answer:", error);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 },
    );
  }
}
