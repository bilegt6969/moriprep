import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Cache the questions data in memory to avoid repeated file reads
let cachedRWQuestionsData: any = null;
let cachedMathQuestionsData: any = null;
let rwQuestionsPath: string = "";
let mathQuestionsPath: string = "";

function loadQuestionsData(testType: string = "Reading and Writing") {
  if (testType === "Math") {
    if (cachedMathQuestionsData === null) {
      console.log("Loading math questions from math_questions.json...");
      mathQuestionsPath = path.join(process.cwd(), "math_questions.json");
      cachedMathQuestionsData = JSON.parse(
        fs.readFileSync(mathQuestionsPath, "utf8"),
      );
      console.log(
        "Math questions loaded and cached. Total questions:",
        cachedMathQuestionsData.length,
      );
    }
    return cachedMathQuestionsData;
  } else {
    if (cachedRWQuestionsData === null) {
      console.log("Loading questions from questions.json...");
      rwQuestionsPath = path.join(process.cwd(), "questions.json");
      cachedRWQuestionsData = JSON.parse(
        fs.readFileSync(rwQuestionsPath, "utf8"),
      );
      console.log(
        "Questions loaded and cached. Total questions:",
        cachedRWQuestionsData.length,
      );
    }
    return cachedRWQuestionsData;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const test = searchParams.get("test") || "Reading and Writing";
    const questionsData = loadQuestionsData(test);

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
    const attempt_filter = searchParams.get("attempt_filter");
    const status_filter = searchParams.get("status_filter");

    console.log("Query params:", {
      test,
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
      attempt_filter,
      status_filter,
    });

    // If question_id is provided, return only that question
    if (question_id) {
      let filtered = questionsData;

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

      const question = filtered.find((q: any) => q.question_id === question_id);
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

    // Note: attempt_filter and status_filter are handled client-side
    // since we don't have Firebase Admin SDK credentials configured

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
