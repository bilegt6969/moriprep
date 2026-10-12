import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
    const userRef = doc(db, "users", authenticatedUserId);
    const userDoc = await getDoc(userRef);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastActiveDate = userData.lastActiveDate;

      if (lastActiveDate === today) {
        // Already active today, no streak update needed
        return NextResponse.json({
          currentStreak: userData.currentStreak || 0,
          longestStreak: userData.longestStreak || 0,
        });
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = userData.currentStreak || 0;
      let newLongestStreak = userData.longestStreak || 0;

      if (lastActiveDate === yesterdayStr) {
        // Streak continues
        newStreak += 1;
      } else if (lastActiveDate !== today) {
        // Streak broken (unless first time)
        newStreak = 1;
      }

      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak;
      }

      await updateDoc(userRef, {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today,
      });

      return NextResponse.json({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
      });
    } else {
      // First time user
      await setDoc(userRef, {
        userId: authenticatedUserId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
      });

      return NextResponse.json({
        currentStreak: 1,
        longestStreak: 1,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { error: "Failed to update streak" },
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
    const userRef = doc(db, "users", authenticatedUserId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return NextResponse.json({
        currentStreak: userData.currentStreak || 0,
        longestStreak: userData.longestStreak || 0,
        lastActiveDate: userData.lastActiveDate || null,
      });
    }

    return NextResponse.json({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error fetching streak:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak" },
      { status: 500 },
    );
  }
}
