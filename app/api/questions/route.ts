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
    const offset = searchParams.get("offset");
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
      offset,
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

    // If no filters are provided, return empty count
    if (!domain && !difficulty && !skill) {
      if (count_only === "true") {
        console.log("No filters provided, returning count: 0");
        return NextResponse.json({ count: 0 });
      }
      console.log("No filters provided, returning empty array");
      return NextResponse.json([]);
    }

    // Log initial counts for debugging
    console.log("Total questions in database:", questionsData.length);
    console.log(
      "Questions with domain:",
      questionsData.filter((q: any) => q.domain).length,
    );
    console.log(
      "Questions with difficulty:",
      questionsData.filter((q: any) => q.difficulty).length,
    );

    // Log unique domain names in database
    const uniqueDomains = Array.from(
      new Set(questionsData.map((q: any) => q.domain).filter(Boolean)),
    );
    console.log("Unique domains in database:", uniqueDomains);
    console.log(
      "Domain counts:",
      uniqueDomains.map((d) => ({
        domain: d,
        count: questionsData.filter((q: any) => q.domain === d).length,
      })),
    );

    // Log unique skill names in database
    const uniqueSkills = Array.from(
      new Set(questionsData.map((q: any) => q.skill).filter(Boolean)),
    );
    console.log("Unique skills in database:", uniqueSkills);
    console.log(
      "Skill counts:",
      uniqueSkills.map((s) => ({
        skill: s,
        count: questionsData.filter((q: any) => q.skill === s).length,
      })),
    );

    if (domain) {
      const domains = domain.split(",").map((d) => d.trim());
      const beforeFilter = filtered.length;
      filtered = filtered.filter((q: any) => domains.includes(q.domain));
      console.log(
        `Domain filter: ${domains.join(", ")} - Before: ${beforeFilter}, After: ${filtered.length}`,
      );
    }
    if (difficulty) {
      const difficulties = difficulty.split(",").map((d) => d.trim());
      const beforeFilter = filtered.length;
      filtered = filtered.filter((q: any) =>
        difficulties.includes(q.difficulty),
      );
      console.log(
        `Difficulty filter: ${difficulties.join(", ")} - Before: ${beforeFilter}, After: ${filtered.length}`,
      );
    }
    if (skill) {
      const skills = skill.split(",").map((s) => s.trim());
      const beforeFilter = filtered.length;
      filtered = filtered.filter((q: any) => skills.includes(q.skill));
      console.log(
        `Skill filter: ${skills.join(", ")} - Before: ${beforeFilter}, After: ${filtered.length}`,
      );
    }

    // If count_only is true, return just the count
    if (count_only === "true") {
      console.log("Returning count only:", filtered.length);
      return NextResponse.json({ count: filtered.length });
    }

    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = offset ? parseInt(offset) : 0;
      filtered = filtered.slice(offsetNum, offsetNum + limitNum);
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
