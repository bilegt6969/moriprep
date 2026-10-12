import { verifyIdToken } from "@/lib/auth/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

    // Get only the authenticated user's profile
    const userDoc = await getDoc(doc(db, "users", authenticatedUserId));

    if (userDoc.exists()) {
      return NextResponse.json(userDoc.data());
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();

    // Sanitize and validate data - only allow specific fields
    const allowedFields = [
      "name",
      "photoURL",
      "school",
      "role",
      "graduationYear",
      "bestTotalScore",
      "goalScore",
      "dailyGoal",
      "satTestDates",
      "currentStreak",
      "longestStreak",
      "totalStudyTime",
      "sessionsCompleted",
      "previousScores",
      "preferredStudyTime",
      "weeklyStudyHours",
      "gpa",
      "targetColleges",
      "careerInterests",
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Prevent userId overwrite
    if (body.userId !== undefined && body.userId !== authenticatedUserId) {
      return NextResponse.json(
        { error: "Cannot modify userId" },
        { status: 403 },
      );
    }

    await updateDoc(doc(db, "users", authenticatedUserId), updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
