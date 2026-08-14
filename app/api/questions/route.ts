import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Cache the questions data in memory to avoid repeated file reads
let cachedQuestionsData: any = null;
let questionsPath: string = "";

function loadQuestionsData() {
  if (cachedQuestionsData === null) {
    console.log("Loading questions from questions.json...");
    questionsPath = path.join(process.cwd(), "questions.json");
    cachedQuestionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
    console.log(
      "Questions loaded and cached. Total questions:",
      cachedQuestionsData.length,
    );
  }
  return cachedQuestionsData;
}

export async function GET(request: NextRequest) {
  try {
    const questionsData = loadQuestionsData();

    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get("domain");
    const difficulty = searchParams.get("difficulty");
    const skill = searchParams.get("skill");
    const limit = searchParams.get("limit");
    const question_id = searchParams.get("question_id");
    const question_ids = searchParams.get("question_ids");
    const count_only = searchParams.get("count_only");
    const domains_only = searchParams.get("domains_only");
    const skills_only = searchParams.get("skills_only");

    console.log("Query params:", {
      domain,
      difficulty,
      skill,
      limit,
      question_id,
      question_ids,
      count_only,
      domains_only,
      skills_only,
    });

    // If question_id is provided, return only that question
    if (question_id) {
      const question = questionsData.find(
        (q: any) => q.question_id === question_id,
      );
      if (question) {
        console.log("Found question by ID:", question_id);
        return NextResponse.json([question]);
      } else {
        console.log("Question not found:", question_id);
        return NextResponse.json([]);
      }
    }

    // If question_ids is provided, return only those questions
    if (question_ids) {
      const ids = question_ids.split(",").map((id) => id.trim());
      const filteredQuestions = questionsData.filter((q: any) =>
        ids.includes(q.question_id),
      );
      console.log("Found", filteredQuestions.length, "questions by IDs");
      return NextResponse.json(filteredQuestions);
    }

    // If domains_only is true, return just unique domains
    if (domains_only === "true") {
      const domains = Array.from(
        new Set(questionsData.map((q: any) => q.domain)),
      );
      console.log("Returning domains only:", domains.length);
      return NextResponse.json(domains);
    }

    // If skills_only is true, return just unique skills
    if (skills_only === "true") {
      const skills = Array.from(
        new Set(questionsData.map((q: any) => q.skill)),
      );
      console.log("Returning skills only:", skills.length);
      return NextResponse.json(skills);
    }

    let filtered = questionsData;

    if (domain) {
      const domains = domain.split(",").map((d) => d.trim());
      filtered = filtered.filter((q: any) => domains.includes(q.domain));
    }
    if (difficulty) {
      const difficulties = difficulty.split(",").map((d) => d.trim());
      filtered = filtered.filter((q: any) =>
        difficulties.includes(q.difficulty),
      );
    }
    if (skill) {
      const skills = skill.split(",").map((s) => s.trim());
      filtered = filtered.filter((q: any) => skills.includes(q.skill));
    }

    // If count_only is true, return just the count
    if (count_only === "true") {
      console.log("Returning count only:", filtered.length);
      return NextResponse.json({ count: filtered.length });
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
