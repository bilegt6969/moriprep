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
