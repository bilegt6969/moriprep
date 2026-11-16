import { describe, expect, it } from "vitest";
import type { DSATQuestion, SATMathQuestion } from "@/types/dsat";
import { selectMixedPracticeQuestions } from "./mixed-practice";

function makeRwQuestion(id: number): DSATQuestion {
  return {
    question_id: `rw-${id}`,
    assessment: "SAT",
    test: "Reading and Writing",
    domain: "Information and Ideas",
    skill: "Central Ideas and Details",
    difficulty: "Medium",
    passage: "",
    prompt: "Prompt",
    question: "Question",
    choices: { A: "A", B: "B" },
    correct_answer: "A",
    correct_answer_text: "A",
    rationale: "",
    parse_status: "strict",
    source_file: "",
    has_graphic: false,
    graphics: [],
    has_underline: false,
    raw_text: "",
  };
}

function makeMathQuestion(id: number): SATMathQuestion {
  return {
    question_id: `math-${id}`,
    assessment: "SAT",
    test: "Math",
    domain: "Algebra",
    skill: "Linear equations",
    difficulty: "Medium",
    question_type: "mcq",
    question: "Question",
    math_expressions: [],
    has_figure: false,
    figures: [],
    choices: { A: "A", B: "B" },
    correct_answer: "A",
    correct_answer_text: "A",
    rationale: "",
    parse_status: "strict",
    source_page: 1,
  };
}

describe("selectMixedPracticeQuestions", () => {
  it("selects 10 unique questions from each section and interleaves them", () => {
    const selected = selectMixedPracticeQuestions(
      Array.from({ length: 15 }, (_, index) => makeRwQuestion(index)),
      Array.from({ length: 16 }, (_, index) => makeMathQuestion(index)),
      () => 0.5,
    );

    expect(selected).toHaveLength(20);
    expect(
      selected.filter((item) => item.section === "Reading & Writing"),
    ).toHaveLength(10);
    expect(selected.filter((item) => item.section === "Math")).toHaveLength(10);
    expect(new Set(selected.map((item) => item.question.question_id)).size).toBe(
      20,
    );
    expect(
      selected.every(
        (item, index) =>
          index === 0 || item.section !== selected[index - 1].section,
      ),
    ).toBe(true);
  });

  it("requires at least 10 questions from both sections", () => {
    expect(() =>
      selectMixedPracticeQuestions(
        Array.from({ length: 9 }, (_, index) => makeRwQuestion(index)),
        Array.from({ length: 10 }, (_, index) => makeMathQuestion(index)),
      ),
    ).toThrow("Not enough questions available");
  });
});
