import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
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
    const { questionId, reportType, details } = body;

    // Validate required fields
    if (!questionId || !reportType || !details) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedQuestionId = String(questionId).trim();
    const sanitizedReportType = String(reportType).trim();
    const sanitizedDetails = String(details).trim();

    // Create report with server-controlled userId
    const reportRef = doc(collection(db, "questionReports"));
    const report = {
      userId: authenticatedUserId, // Server-enforced ownership
      questionId: sanitizedQuestionId,
      reportType: sanitizedReportType,
      details: sanitizedDetails,
      createdAt: new Date(),
    };

    await setDoc(reportRef, report);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error saving question report:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 },
    );
  }
}
