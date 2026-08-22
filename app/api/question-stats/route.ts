import { db, doc, getDoc } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      console.error("Firebase db is not initialized");
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get("domain");
    const skill = searchParams.get("skill");
    const difficulty = searchParams.get("difficulty");
    const userId = searchParams.get("userId");

    // If userId is provided, fetch user-specific stats
    if (userId) {
      const userStatsRef = doc(db, "userQuestionStats", userId);
      const userStatsDoc = await getDoc(userStatsRef);

      if (!userStatsDoc.exists()) {
        console.log("User stats not found in Firebase for user:", userId);
        // Return empty user stats if not found
        return NextResponse.json({
          totalAnswered: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          domains: {},
          skills: {},
          difficulties: {},
        });
      }

      const userStats = userStatsDoc.data();
      console.log("Fetched user stats from Firebase for user:", userId);

      // If no filters, return full user stats
      if (!domain && !skill && !difficulty) {
        return NextResponse.json(userStats);
      }

      // Calculate filtered count based on filters
      let answered = 0;
      let correct = 0;
      let incorrect = 0;

      if (domain && skill) {
        // Get stats for specific domain + skill combination
        const skillStats = userStats?.skills?.[skill] || {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
        answered = skillStats.answered;
        correct = skillStats.correct;
        incorrect = skillStats.incorrect;
      } else if (domain) {
        // Get stats for specific domain
        const domainStats = userStats?.domains?.[domain] || {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
        answered = domainStats.answered;
        correct = domainStats.correct;
        incorrect = domainStats.incorrect;
      } else if (skill) {
        // Get stats for specific skill (global)
        const skillStats = userStats?.skills?.[skill] || {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
        answered = skillStats.answered;
        correct = skillStats.correct;
        incorrect = skillStats.incorrect;
      } else if (difficulty) {
        // Get stats for specific difficulty
        const difficultyStats = userStats?.difficulties?.[difficulty] || {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
        answered = difficultyStats.answered;
        correct = difficultyStats.correct;
        incorrect = difficultyStats.incorrect;
      }

      return NextResponse.json({ answered, correct, incorrect });
    }

    // Fetch stats from Firebase
    const statsRef = doc(db, "questionStats", "summary");
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      console.log("Question stats not found in Firebase");
      return NextResponse.json(
        { error: "Question stats not found" },
        { status: 404 },
      );
    }

    const stats = statsDoc.data();
    console.log("Fetched question stats from Firebase");

    // If no filters, return full stats
    if (!domain && !skill && !difficulty) {
      return NextResponse.json(stats);
    }

    // Calculate filtered count based on filters
    let count = 0;

    if (domain && skill) {
      // Get count for specific domain + skill combination
      count = stats?.domainSkills?.[domain]?.[skill] || 0;
    } else if (domain) {
      // Get count for specific domain
      count = stats?.domains?.[domain] || 0;
    } else if (skill) {
      // Get count for specific skill (global)
      count = stats?.skills?.[skill] || 0;
    } else if (difficulty) {
      // Get count for specific difficulty
      count = stats?.difficulties?.[difficulty] || 0;
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching question stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch question stats" },
      { status: 500 },
    );
  }
}
