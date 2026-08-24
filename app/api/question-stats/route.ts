import { db, doc, getDoc } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

// Sanitize field names to match the script
function sanitizeFieldName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}

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

    console.log("=== question-stats API called ===");
    console.log("domain:", domain);
    console.log("skill:", skill);
    console.log("difficulty:", difficulty);
    console.log("userId:", userId);
    console.log(
      "All searchParams:",
      Object.fromEntries(searchParams.entries()),
    );

    // Handle multiple domains (comma-separated or multiple params)
    const domains = domain ? domain.split(",").map((d) => d.trim()) : [];
    const allDomains = searchParams.getAll("domain").map((d) => d.trim());
    const combinedDomains = [...new Set([...domains, ...allDomains])];

    // Handle multiple skills (comma-separated or multiple params)
    const skills = skill ? skill.split(",").map((s) => s.trim()) : [];
    const allSkills = searchParams.getAll("skill").map((s) => s.trim());
    const combinedSkills = [...new Set([...skills, ...allSkills])];

    // Handle multiple difficulties (comma-separated)
    const difficulties = difficulty
      ? difficulty.split(",").map((d) => d.trim())
      : [];

    console.log("Parsed domains:", combinedDomains);
    console.log("Parsed skills:", combinedSkills);
    console.log("Parsed difficulties:", difficulties);

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
          domainCounts: {},
          skillCounts: {},
          difficultyCounts: {},
        });
      }

      const userStats = userStatsDoc.data();
      console.log("Fetched user stats from Firebase for user:", userId);

      // If no filters, return full user stats
      if (
        combinedDomains.length === 0 &&
        combinedSkills.length === 0 &&
        difficulties.length === 0
      ) {
        console.log("No filters, returning full user stats");
        return NextResponse.json(userStats);
      }

      // Calculate filtered count based on filters using sanitized keys
      let answered = 0;
      let correct = 0;
      let incorrect = 0;

      console.log("Calculating filtered user stats...");

      // If domains and skills are both provided, use skill-level stats (more specific)
      if (combinedDomains.length > 0 && combinedSkills.length > 0) {
        console.log(
          "Using skill-level stats for domains:",
          combinedDomains,
          "skills:",
          combinedSkills,
        );
        combinedSkills.forEach((skill) => {
          const sanitizedSkill = sanitizeFieldName(skill);
          const skillData = userStats?.skillCounts?.[sanitizedSkill];
          if (skillData) {
            answered += skillData.answered;
            correct += skillData.correct;
            incorrect += skillData.incorrect;
          }
        });
      } else if (combinedDomains.length > 0) {
        console.log("Using domain-level stats for domains:", combinedDomains);
        combinedDomains.forEach((domain) => {
          const sanitizedDomain = sanitizeFieldName(domain);
          const domainData = userStats?.domainCounts?.[sanitizedDomain];
          if (domainData) {
            answered += domainData.answered;
            correct += domainData.correct;
            incorrect += domainData.incorrect;
          }
        });
      } else if (combinedSkills.length > 0) {
        console.log("Using skill-level stats for skills:", combinedSkills);
        combinedSkills.forEach((skill) => {
          const sanitizedSkill = sanitizeFieldName(skill);
          const skillData = userStats?.skillCounts?.[sanitizedSkill];
          if (skillData) {
            answered += skillData.answered;
            correct += skillData.correct;
            incorrect += skillData.incorrect;
          }
        });
      } else if (difficulties.length > 0) {
        console.log(
          "Using difficulty-level stats for difficulties:",
          difficulties,
        );
        difficulties.forEach((diff) => {
          const sanitizedDiff = sanitizeFieldName(diff);
          const diffData = userStats?.difficultyCounts?.[sanitizedDiff];
          if (diffData) {
            answered += diffData.answered;
            correct += diffData.correct;
            incorrect += diffData.incorrect;
          }
        });
      }

      console.log(
        "Filtered user stats - answered:",
        answered,
        "correct:",
        correct,
        "incorrect:",
        incorrect,
      );
      return NextResponse.json({ answered, correct, incorrect });
    }

    // Fetch global stats from Firebase
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
    if (
      combinedDomains.length === 0 &&
      combinedSkills.length === 0 &&
      difficulties.length === 0
    ) {
      console.log("No filters, returning full global stats");
      return NextResponse.json(stats);
    }

    // Calculate filtered count based on filters using sanitized keys
    let count = 0;

    console.log("Calculating filtered global stats...");

    // If domains and skills are both provided, use skill-level stats (more specific)
    if (combinedDomains.length > 0 && combinedSkills.length > 0) {
      console.log(
        "Using skill-level stats for domains:",
        combinedDomains,
        "skills:",
        combinedSkills,
      );
      combinedSkills.forEach((skill) => {
        const sanitizedSkill = sanitizeFieldName(skill);
        count += stats?.skillCounts?.[sanitizedSkill] || 0;
      });
    } else if (combinedDomains.length > 0) {
      console.log("Using domain-level stats for domains:", combinedDomains);
      combinedDomains.forEach((domain) => {
        const sanitizedDomain = sanitizeFieldName(domain);
        count += stats?.domainCounts?.[sanitizedDomain] || 0;
      });
    } else if (combinedSkills.length > 0) {
      console.log("Using skill-level stats for skills:", combinedSkills);
      combinedSkills.forEach((skill) => {
        const sanitizedSkill = sanitizeFieldName(skill);
        count += stats?.skillCounts?.[sanitizedSkill] || 0;
      });
    } else if (difficulties.length > 0) {
      console.log(
        "Using difficulty-level stats for difficulties:",
        difficulties,
      );
      count = difficulties.reduce((sum, diff) => {
        const sanitizedDiff = sanitizeFieldName(diff);
        return sum + (stats?.difficultyCounts?.[sanitizedDiff] || 0);
      }, 0);
    }

    console.log("Filtered global count:", count);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching question stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch question stats" },
      { status: 500 },
    );
  }
}
