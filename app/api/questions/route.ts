import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching questions from questions.json...");

    // Read from local questions.json file
    const questionsPath = path.join(process.cwd(), "questions.json");
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get("domain");
    const difficulty = searchParams.get("difficulty");
    const skill = searchParams.get("skill");
    const limit = searchParams.get("limit");

    console.log("Query params:", { domain, difficulty, skill, limit });

    let filtered = questionsData;

    if (domain) {
      filtered = filtered.filter((q: any) => q.domain === domain);
    }
    if (difficulty) {
      filtered = filtered.filter((q: any) => q.difficulty === difficulty);
    }
    if (skill) {
      filtered = filtered.filter((q: any) => q.skill === skill);
    }
    if (limit) {
      filtered = filtered.slice(0, parseInt(limit));
    }

    console.log("Returning", filtered.length, "questions");
    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching questions:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Failed to fetch questions", details: String(error) },
      { status: 500 },
    );
  }
}
