import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const authenticatedUserId = await verifyAuthToken(request);

    // Fetch user progress
    const progressQuery = query(
      collection(db, "userProgress"),
      where("userId", "==", authenticatedUserId),
    );
    const progressSnapshot = await getDocs(progressQuery);
    const userProgress = progressSnapshot.docs.map((doc) => doc.data());

    // Calculate domain analytics
    const domainStats: Record<string, {
      totalTime: number;
      totalAttempts: number;
      correctAttempts: number;
      averageTime: number;
      accuracy: number;
      questionsAnswered: number;
    }> = {};

    userProgress.forEach((progress: any) => {
      const domain = progress.domain || "Unknown";
      const attempts = progress.attempts || [];

      if (!domainStats[domain]) {
        domainStats[domain] = {
          totalTime: 0,
          totalAttempts: 0,
          correctAttempts: 0,
          averageTime: 0,
          accuracy: 0,
          questionsAnswered: 0,
        };
      }

      attempts.forEach((attempt: any) => {
        domainStats[domain].totalTime += attempt.timeSpent || 0;
        domainStats[domain].totalAttempts += 1;
        if (attempt.isCorrect) {
          domainStats[domain].correctAttempts += 1;
        }
      });

      domainStats[domain].questionsAnswered += 1;
    });

    // Calculate averages
    Object.keys(domainStats).forEach((domain) => {
      const stats = domainStats[domain];
      stats.averageTime = stats.totalAttempts > 0 ? stats.totalTime / stats.totalAttempts : 0;
      stats.accuracy = stats.totalAttempts > 0 ? (stats.correctAttempts / stats.totalAttempts) * 100 : 0;
    });

    // Convert to array and sort by time spent
    const analytics = Object.entries(domainStats).map(([domain, stats]) => ({
      domain,
      ...stats,
    })).sort((a, b) => b.totalTime - a.totalTime);

    return NextResponse.json(analytics);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error fetching domain analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch domain analytics" },
      { status: 500 },
    );
  }
}
