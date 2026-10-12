import type { DSATQuestion } from "@/types/dsat";
import { describe, expect, it } from "vitest";
import {
    getCorrectDisplay,
    getCorrectKey,
    isAnswerCorrect,
    pct,
    summarize,
    type TestAttempt,
} from "./test-attempts";

describe("test-attempts - Answer Validation", () => {
  describe("isAnswerCorrect", () => {
    it("should return false for null or empty answers", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Information and Ideas",
        skill: "Central Ideas",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test question",
        choices: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
        correct_answer: "A",
        correct_answer_text: "Option A",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, undefined)).toBe(false);
      expect(isAnswerCorrect(question, "")).toBe(false);
      expect(isAnswerCorrect(question, "   ")).toBe(false);
    });

    it("should correctly validate multiple choice answers by key", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Information and Ideas",
        skill: "Central Ideas",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test question",
        choices: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
        correct_answer: "A",
        correct_answer_text: "Option A",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, "A")).toBe(true);
      expect(isAnswerCorrect(question, "a")).toBe(true);
      expect(isAnswerCorrect(question, " A ")).toBe(true);
      expect(isAnswerCorrect(question, "B")).toBe(false);
    });

    it("should correctly validate multiple choice answers by key even when correct_answer is the text", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Information and Ideas",
        skill: "Central Ideas",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test question",
        choices: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
        correct_answer: "Option A",
        correct_answer_text: "Option A",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      // When correct_answer is the text, getCorrectKey resolves it to the choice key
      // Students should still answer with the choice key (A/B/C/D), not the text
      expect(isAnswerCorrect(question, "A")).toBe(true);
      expect(isAnswerCorrect(question, "a")).toBe(true);
      expect(isAnswerCorrect(question, " A ")).toBe(true);
      expect(isAnswerCorrect(question, "B")).toBe(false);
      // The text itself is not accepted as an answer when choices exist
      expect(isAnswerCorrect(question, "Option A")).toBe(false);
    });

    it("should handle student-produced response with accepted_answers", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Algebra",
        skill: "Linear Equations",
        difficulty: "Medium",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Solve for x",
        choices: {},
        correct_answer: "5",
        correct_answer_text: "5",
        accepted_answers: ["5", "5.0", "5,0"],
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, "5")).toBe(true);
      expect(isAnswerCorrect(question, "5.0")).toBe(true);
      expect(isAnswerCorrect(question, "5,0")).toBe(true);
      expect(isAnswerCorrect(question, "6")).toBe(false);
    });

    it("should handle comma-separated answers (spaces are NOT normalized)", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Algebra",
        skill: "Linear Equations",
        difficulty: "Medium",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Enter values",
        choices: {},
        correct_answer: "1,2,3",
        correct_answer_text: "1,2,3",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      // The norm function only removes commas, not spaces
      expect(isAnswerCorrect(question, "1,2,3")).toBe(true);
      expect(isAnswerCorrect(question, "1 2 3")).toBe(false); // spaces are not removed
      expect(isAnswerCorrect(question, "1, 2, 3")).toBe(false); // spaces after commas are not removed
    });

    it("should handle missing or malformed question data gracefully", () => {
      const questionNoChoices: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
        correct_answer: "",
        correct_answer_text: "",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(questionNoChoices, "A")).toBe(false);
    });

    it("should handle SPR without accepted_answers by comparing to correct_answer", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Algebra",
        skill: "Linear Equations",
        difficulty: "Medium",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Solve for x",
        choices: {},
        correct_answer: "42",
        correct_answer_text: "42",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, "42")).toBe(true);
      expect(isAnswerCorrect(question, "42.0")).toBe(false); // exact match without accepted_answers
    });

    it("should handle numeric answer variations with accepted_answers", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Algebra",
        skill: "Linear Equations",
        difficulty: "Medium",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Solve for x",
        choices: {},
        correct_answer: "5",
        correct_answer_text: "5",
        accepted_answers: ["5", "5.0", "5,0", "5.00"],
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, "5")).toBe(true);
      expect(isAnswerCorrect(question, "5.0")).toBe(true);
      expect(isAnswerCorrect(question, "5,0")).toBe(true);
      expect(isAnswerCorrect(question, "5.00")).toBe(true);
      expect(isAnswerCorrect(question, "5.000")).toBe(false); // not in accepted_answers
    });

    it("should handle case insensitivity for SPR answers", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Algebra",
        skill: "Linear Equations",
        difficulty: "Medium",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Enter answer",
        choices: {},
        correct_answer: "X",
        correct_answer_text: "X",
        accepted_answers: ["x", "X"],
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, "x")).toBe(true);
      expect(isAnswerCorrect(question, "X")).toBe(true);
      expect(isAnswerCorrect(question, " x ")).toBe(true);
    });

    it("should handle trailing/leading whitespace in SPR answers", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Algebra",
        skill: "Linear Equations",
        difficulty: "Medium",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Enter value",
        choices: {},
        correct_answer: "42",
        correct_answer_text: "42",
        accepted_answers: ["42"],
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, " 42 ")).toBe(true);
      expect(isAnswerCorrect(question, "\t42\t")).toBe(true);
      expect(isAnswerCorrect(question, "42")).toBe(true);
    });

    it("should handle SPR with fractions and mixed numbers", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Algebra",
        skill: "Linear Equations",
        difficulty: "Medium",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Enter fraction",
        choices: {},
        correct_answer: "1/2",
        correct_answer_text: "1/2",
        accepted_answers: ["1/2", "0.5", ".5"],
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(isAnswerCorrect(question, "1/2")).toBe(true);
      expect(isAnswerCorrect(question, "0.5")).toBe(true);
      expect(isAnswerCorrect(question, ".5")).toBe(true);
      expect(isAnswerCorrect(question, "2/4")).toBe(false); // not in accepted_answers
    });

    it("should handle questions with both choices and accepted_answers (edge case)", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Medium",
        question_type: "mcq",
        passage: "",
        prompt: "",
        question: "Test",
        choices: { A: "Option A", B: "Option B" },
        correct_answer: "A",
        correct_answer_text: "Option A",
        accepted_answers: ["A", "B"], // Edge case: accepted_answers with MCQ
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      // When accepted_answers exists, it takes precedence over choice key matching
      expect(isAnswerCorrect(question, "A")).toBe(true);
      expect(isAnswerCorrect(question, "B")).toBe(true); // Accepted via accepted_answers
    });
  });

  describe("getCorrectKey", () => {
    it("should return the correct choice key for MCQ", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: { A: "Wrong", B: "Correct", C: "Wrong", D: "Wrong" },
        correct_answer: "B",
        correct_answer_text: "Correct",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(getCorrectKey(question)).toBe("B");
    });

    it("should return null when no choices exist", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
        correct_answer: "5",
        correct_answer_text: "5",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(getCorrectKey(question)).toBeNull();
    });

    it("should return null when correct_answer is missing", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: { A: "A", B: "B" },
        correct_answer: "",
        correct_answer_text: "",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(getCorrectKey(question)).toBeNull();
    });
  });

  describe("getCorrectDisplay", () => {
    it("should return accepted answers joined by 'or' for SPR", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Easy",
        question_type: "spr",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
        correct_answer: "5",
        correct_answer_text: "5",
        accepted_answers: ["5", "5.0", "5,0"],
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(getCorrectDisplay(question)).toBe("5  or  5.0  or  5,0");
    });

    it("should return choice key for MCQ", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: { A: "A", B: "B" },
        correct_answer: "A",
        correct_answer_text: "A",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      expect(getCorrectDisplay(question)).toBe("A");
    });

    it("should return empty string when no answer can be determined", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Test",
        skill: "Test",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
        correct_answer: "",
        correct_answer_text: "",
        rationale: "",
        parse_status: "ok",
        source_file: "test",
        has_graphic: false,
        graphics: [],
        has_underline: false,
        raw_text: "",
      };

      // When no choices, no accepted_answers, and no correct_answer, returns empty string
      expect(getCorrectDisplay(question)).toBe("");
    });
  });
});

describe("test-attempts - Scoring", () => {
  describe("pct", () => {
    it("should calculate percentage correctly", () => {
      expect(pct({ correct: 5, total: 10, skipped: 0 })).toBe(50);
      expect(pct({ correct: 3, total: 4, skipped: 0 })).toBe(75);
      expect(pct({ correct: 0, total: 10, skipped: 0 })).toBe(0);
      expect(pct({ correct: 10, total: 10, skipped: 0 })).toBe(100);
    });

    it("should return 0 for zero total", () => {
      expect(pct({ correct: 0, total: 0, skipped: 0 })).toBe(0);
    });

    it("should round to nearest integer", () => {
      expect(pct({ correct: 1, total: 3, skipped: 0 })).toBe(33);
      expect(pct({ correct: 2, total: 3, skipped: 0 })).toBe(67);
    });

    it("should handle skipped questions in percentage", () => {
      // Skipped questions count toward total but not correct
      expect(pct({ correct: 5, total: 10, skipped: 2 })).toBe(50);
      expect(pct({ correct: 0, total: 5, skipped: 5 })).toBe(0);
    });
  });

  describe("summarize", () => {
    it("should calculate overall score correctly", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Information and Ideas",
                skill: "Central Ideas",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
              {
                question_id: "2",
                assessment: "test",
                test: "test",
                domain: "Information and Ideas",
                skill: "Inferences",
                difficulty: "Medium",
                passage: "",
                prompt: "",
                question: "Q2",
                choices: { A: "A", B: "B" },
                correct_answer: "B",
                correct_answer_text: "B",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A", 1: "B" },
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.overall.correct).toBe(2);
      expect(result.overall.total).toBe(2);
      expect(result.overall.skipped).toBe(0);
      expect(pct(result.overall)).toBe(100);
    });

    it("should handle skipped questions", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "" },
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.overall.correct).toBe(0);
      expect(result.overall.total).toBe(1);
      expect(result.overall.skipped).toBe(1);
      expect(pct(result.overall)).toBe(0);
    });

    it("should calculate domain breakdown", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Information and Ideas",
                skill: "Central Ideas",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
              {
                question_id: "2",
                assessment: "test",
                test: "test",
                domain: "Craft and Structure",
                skill: "Words in Context",
                difficulty: "Medium",
                passage: "",
                prompt: "",
                question: "Q2",
                choices: { A: "A", B: "B" },
                correct_answer: "B",
                correct_answer_text: "B",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A", 1: "B" },
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(
        result.domains["Reading and Writing"]["Information and Ideas"].correct,
      ).toBe(1);
      expect(
        result.domains["Reading and Writing"]["Information and Ideas"].total,
      ).toBe(1);
      expect(
        result.domains["Reading and Writing"]["Craft and Structure"].correct,
      ).toBe(1);
      expect(
        result.domains["Reading and Writing"]["Craft and Structure"].total,
      ).toBe(1);
    });

    it("should handle questions without domain", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A" },
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.domains["Reading and Writing"]["Other"]).toBeDefined();
      expect(result.domains["Reading and Writing"]["Other"].correct).toBe(1);
    });

    it("should handle empty question set", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [],
            answers: {},
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.overall.correct).toBe(0);
      expect(result.overall.total).toBe(0);
      expect(result.overall.skipped).toBe(0);
      expect(pct(result.overall)).toBe(0);
    });

    it("should handle missing answers object", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: {} as any, // Empty answers object
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      // Empty answers should be treated as skipped
      expect(result.overall.correct).toBe(0);
      expect(result.overall.total).toBe(1);
      expect(result.overall.skipped).toBe(1);
    });

    it("should handle mixed correct, incorrect, and skipped answers", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
              {
                question_id: "2",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q2",
                choices: { A: "A", B: "B" },
                correct_answer: "B",
                correct_answer_text: "B",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
              {
                question_id: "3",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q3",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A", 1: "A", 2: "" }, // Correct, incorrect, skipped
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.overall.correct).toBe(1);
      expect(result.overall.total).toBe(3);
      expect(result.overall.skipped).toBe(1);
      expect(pct(result.overall)).toBe(33);
    });

    it("should calculate skill-level breakdown", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Information and Ideas",
                skill: "Central Ideas",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
              {
                question_id: "2",
                assessment: "test",
                test: "test",
                domain: "Information and Ideas",
                skill: "Central Ideas",
                difficulty: "Medium",
                passage: "",
                prompt: "",
                question: "Q2",
                choices: { A: "A", B: "B" },
                correct_answer: "B",
                correct_answer_text: "B",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A", 1: "B" },
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.skillList).toHaveLength(1);
      expect(result.skillList[0].name).toBe("Central Ideas");
      expect(result.skillList[0].correct).toBe(2);
      expect(result.skillList[0].total).toBe(2);
    });

    it("should handle multiple modules in a single attempt", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A" },
            marked: [],
          },
          {
            section: "Reading and Writing",
            module: 2,
            difficulty: "Hard",
            questions: [
              {
                question_id: "2",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Hard",
                passage: "",
                prompt: "",
                question: "Q2",
                choices: { A: "A", B: "B" },
                correct_answer: "B",
                correct_answer_text: "B",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "B" },
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.modules).toHaveLength(2);
      expect(result.modules[0].tally.correct).toBe(1);
      expect(result.modules[1].tally.correct).toBe(1);
      expect(result.overall.correct).toBe(2);
      expect(result.overall.total).toBe(2);
    });

    it("should calculate module-level stats", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A" },
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.modules).toHaveLength(1);
      expect(result.modules[0].tally.correct).toBe(1);
      expect(result.modules[0].tally.total).toBe(1);
    });

    it("should handle empty question sets", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [],
            answers: {},
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.overall.correct).toBe(0);
      expect(result.overall.total).toBe(0);
      expect(result.overall.skipped).toBe(0);
      expect(pct(result.overall)).toBe(0);
    });

    it("should handle mismatched answers and questions", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A", 1: "B" }, // Extra answer with no question
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      // Should only process available questions
      expect(result.overall.total).toBe(1);
      expect(result.overall.correct).toBe(1);
    });

    it("should handle missing answers for questions", () => {
      const attempt: TestAttempt = {
        id: "test-1",
        testId: "sat-1",
        testName: "Practice Test",
        date: new Date().toISOString(),
        modules: [
          {
            section: "Reading and Writing",
            module: 1,
            difficulty: null,
            questions: [
              {
                question_id: "1",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q1",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
              {
                question_id: "2",
                assessment: "test",
                test: "test",
                domain: "Test",
                skill: "Test",
                difficulty: "Easy",
                passage: "",
                prompt: "",
                question: "Q2",
                choices: { A: "A", B: "B" },
                correct_answer: "A",
                correct_answer_text: "A",
                rationale: "",
                parse_status: "ok",
                source_file: "test",
                has_graphic: false,
                graphics: [],
                has_underline: false,
                raw_text: "",
              },
            ],
            answers: { 0: "A" }, // Missing answer for question 2
            marked: [],
          },
        ],
      };

      const result = summarize(attempt);
      expect(result.overall.total).toBe(2);
      expect(result.overall.correct).toBe(1);
      expect(result.overall.skipped).toBe(1);
    });
  });
});
