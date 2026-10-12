import type { DSATQuestion } from "@/types/dsat";
import { describe, expect, it } from "vitest";
import { resolveDomain, sanitizeFieldName } from "./questions";

describe("dsat/questions - Domain Resolution", () => {
  describe("resolveDomain", () => {
    it("should return domain if present on question", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "Information and Ideas",
        skill: "Central Ideas",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
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

      expect(resolveDomain(question)).toBe("Information and Ideas");
    });

    it("should map skill to domain using fallback mapping", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "",
        skill: "Central Ideas and Details",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
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

      expect(resolveDomain(question)).toBe("Information and Ideas");
    });

    it("should return null for unknown skill", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "",
        skill: "Unknown Skill",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
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

      expect(resolveDomain(question)).toBeNull();
    });

    it("should return null when both domain and skill are missing", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "",
        skill: "",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
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

      expect(resolveDomain(question)).toBeNull();
    });

    it("should handle alternative skill naming", () => {
      const question: DSATQuestion = {
        question_id: "1",
        assessment: "test",
        test: "test",
        domain: "",
        skill: "Command of Evidence",
        difficulty: "Easy",
        passage: "",
        prompt: "",
        question: "Test",
        choices: {},
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

      expect(resolveDomain(question)).toBe("Information and Ideas");
    });

    it("should map all known skills to correct domains", () => {
      const skillDomainPairs = [
        ["Central Ideas and Details", "Information and Ideas"],
        ["Inferences", "Information and Ideas"],
        ["Command of Evidence — Textual", "Information and Ideas"],
        ["Command of Evidence — Quantitative", "Information and Ideas"],
        ["Rhetorical Synthesis", "Expression of Ideas"],
        ["Transitions", "Expression of Ideas"],
        ["Words in Context", "Craft and Structure"],
        ["Text Structure and Purpose", "Craft and Structure"],
        ["Cross-Text Connections", "Craft and Structure"],
        ["Boundaries", "Standard English Conventions"],
        ["Form, Structure, and Sense", "Standard English Conventions"],
      ];

      skillDomainPairs.forEach(([skill, expectedDomain]) => {
        const question: DSATQuestion = {
          question_id: "1",
          assessment: "test",
          test: "test",
          domain: "",
          skill,
          difficulty: "Easy",
          passage: "",
          prompt: "",
          question: "Test",
          choices: {},
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

        expect(resolveDomain(question)).toBe(expectedDomain);
      });
    });
  });
});

describe("dsat/questions - Field Sanitization", () => {
  describe("sanitizeFieldName", () => {
    it("should replace special characters with underscores", () => {
      expect(sanitizeFieldName("Information and Ideas")).toBe(
        "Information_and_Ideas",
      );
      expect(sanitizeFieldName("Test-Field")).toBe("Test_Field");
      expect(sanitizeFieldName("Test@Field")).toBe("Test_Field");
    });

    it("should collapse multiple underscores", () => {
      expect(sanitizeFieldName("Test  &  Field")).toBe("Test_Field");
      expect(sanitizeFieldName("A___B")).toBe("A_B");
    });

    it("should remove leading and trailing underscores", () => {
      expect(sanitizeFieldName("_Test")).toBe("Test");
      expect(sanitizeFieldName("Test_")).toBe("Test");
      expect(sanitizeFieldName("_Test_")).toBe("Test");
    });

    it("should handle empty strings", () => {
      expect(sanitizeFieldName("")).toBe("");
    });

    it("should handle strings with only special characters", () => {
      expect(sanitizeFieldName("___")).toBe("");
      expect(sanitizeFieldName("@#$")).toBe("");
    });

    it("should preserve alphanumeric characters", () => {
      expect(sanitizeFieldName("Test123")).toBe("Test123");
      expect(sanitizeFieldName("ABC")).toBe("ABC");
    });

    it("should handle complex domain names", () => {
      expect(sanitizeFieldName("Standard English Conventions")).toBe(
        "Standard_English_Conventions",
      );
      expect(sanitizeFieldName("Craft and Structure")).toBe(
        "Craft_and_Structure",
      );
    });

    it("should handle mixed special characters", () => {
      expect(sanitizeFieldName("Test@#$Field")).toBe("Test_Field");
      expect(sanitizeFieldName("A-B_C&D")).toBe("A_B_C_D");
    });

    it("should handle numbers", () => {
      expect(sanitizeFieldName("Test 123")).toBe("Test_123");
      expect(sanitizeFieldName("123 Test")).toBe("123_Test");
    });

    it("should preserve case", () => {
      expect(sanitizeFieldName("Test")).toBe("Test");
      expect(sanitizeFieldName("TEST")).toBe("TEST");
      expect(sanitizeFieldName("TeSt")).toBe("TeSt");
    });
  });
});
