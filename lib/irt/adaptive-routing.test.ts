import { describe, expect, it } from "vitest";
import { DEFAULT_PARAMETERS, type QuestionResponse } from "./ability-estimator";
import {
    determineModule2Difficulty,
    determineModule2DifficultySimple,
    generateRoutingReport,
    getParametersForDifficulty,
    getRecommendedModule1Size,
    validateRoutingDecision,
    type Module1Performance,
    type ModuleDifficulty,
} from "./adaptive-routing";

describe("adaptive-routing - Module 2 Difficulty Routing", () => {
  describe("getParametersForDifficulty", () => {
    it("should return Medium parameters for unknown difficulty", () => {
      const params = getParametersForDifficulty("Unknown");
      expect(params).toEqual(DEFAULT_PARAMETERS.Medium);
    });

    it("should return correct parameters for Easy", () => {
      const params = getParametersForDifficulty("Easy");
      expect(params).toEqual(DEFAULT_PARAMETERS.Easy);
    });

    it("should return correct parameters for Medium", () => {
      const params = getParametersForDifficulty("Medium");
      expect(params).toEqual(DEFAULT_PARAMETERS.Medium);
    });

    it("should return correct parameters for Hard", () => {
      const params = getParametersForDifficulty("Hard");
      expect(params).toEqual(DEFAULT_PARAMETERS.Hard);
    });
  });

  describe("determineModule2Difficulty", () => {
    it("should default to Medium when no performance data", () => {
      const performance: Module1Performance = {
        totalQuestions: 0,
        correctCount: 0,
        accuracy: 0,
        responses: [],
      };

      const decision = determineModule2Difficulty(performance);
      expect(decision.module2Difficulty).toBe("Medium");
      expect(decision.confidence).toBe(0);
      expect(decision.reasoning).toContain("No performance data");
    });

    it("should route to Easy for low performance", () => {
      const responses: QuestionResponse[] = Array(10).fill({
        questionId: "1",
        correct: false,
        parameters: DEFAULT_PARAMETERS.Medium,
      });

      const performance: Module1Performance = {
        totalQuestions: 10,
        correctCount: 2,
        accuracy: 0.2,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      expect(decision.module2Difficulty).toBe("Easy");
      expect(decision.abilityEstimate.theta).toBeLessThan(0);
    });

    it("should route to Hard for high performance", () => {
      const responses: QuestionResponse[] = Array(10).fill({
        questionId: "1",
        correct: true,
        parameters: DEFAULT_PARAMETERS.Medium,
      });

      const performance: Module1Performance = {
        totalQuestions: 10,
        correctCount: 9,
        accuracy: 0.9,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      expect(decision.module2Difficulty).toBe("Hard");
      expect(decision.abilityEstimate.theta).toBeGreaterThan(0);
    });

    it("should route to Medium for exactly borderline performance (theta = 0)", () => {
      // Create a mix of correct and incorrect responses at same difficulty
      const responses: QuestionResponse[] = [
        ...Array(5).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
        ...Array(5).fill({
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
      ];

      const performance: Module1Performance = {
        totalQuestions: 10,
        correctCount: 5,
        accuracy: 0.5,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      // With weighted method, theta = (weightedScore - 0.5) * 2
      // With equal correct/incorrect at same difficulty: weightedScore = 0.5, theta = 0
      // Per implementation: theta === 0 should route to Medium
      expect(decision.module2Difficulty).toBe("Medium");
      expect(decision.abilityEstimate.theta).toBe(0);
    });

    it("should handle all-correct responses", () => {
      const responses: QuestionResponse[] = [
        ...Array(10).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
      ];

      const performance: Module1Performance = {
        totalQuestions: 10,
        correctCount: 10,
        accuracy: 1.0,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      expect(decision.module2Difficulty).toBe("Hard");
      expect(decision.abilityEstimate.theta).toBeGreaterThan(0);
    });

    it("should handle all-incorrect responses", () => {
      const responses: QuestionResponse[] = [
        ...Array(10).fill({
          questionId: "1",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
      ];

      const performance: Module1Performance = {
        totalQuestions: 10,
        correctCount: 0,
        accuracy: 0.0,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      expect(decision.module2Difficulty).toBe("Easy");
      expect(decision.abilityEstimate.theta).toBeLessThan(0);
    });

    it("should handle unknown difficulty parameters", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: { a: 1.0, b: 999, c: 0.25 }, // Unknown difficulty
        },
      ];

      const performance: Module1Performance = {
        totalQuestions: 1,
        correctCount: 1,
        accuracy: 1.0,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      // Should still produce a decision without crashing
      expect(decision.module2Difficulty).toBeDefined();
      expect(["Easy", "Medium", "Hard"]).toContain(decision.module2Difficulty);
    });

    it("should handle EAP method", () => {
      const responses: QuestionResponse[] = [
        { questionId: "1", correct: true, parameters: DEFAULT_PARAMETERS.Easy },
        { questionId: "2", correct: true, parameters: DEFAULT_PARAMETERS.Easy },
        {
          questionId: "3",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "4",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "5",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      const performance: Module1Performance = {
        totalQuestions: 5,
        correctCount: 2,
        accuracy: 0.4,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "EAP");
      expect(decision.module2Difficulty).toBeDefined();
      expect(decision.abilityEstimate).toBeDefined();
      expect(decision.reasoning).toContain("IRT ability estimate");
    });

    it("should handle MLE method", () => {
      const responses: QuestionResponse[] = [
        { questionId: "1", correct: true, parameters: DEFAULT_PARAMETERS.Easy },
        { questionId: "2", correct: true, parameters: DEFAULT_PARAMETERS.Easy },
        {
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "4",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "5",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      const performance: Module1Performance = {
        totalQuestions: 5,
        correctCount: 4,
        accuracy: 0.8,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "MLE");
      expect(decision.module2Difficulty).toBeDefined();
      expect(decision.abilityEstimate).toBeDefined();
      expect(decision.reasoning).toContain("IRT ability estimate");
    });

    it("should handle borderline ability estimate (theta near 0)", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "4",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
      ];

      const performance: Module1Performance = {
        totalQuestions: 4,
        correctCount: 2,
        accuracy: 0.5,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      // With exactly 50% accuracy at Medium difficulty, theta should be near 0
      expect(decision.module2Difficulty).toBe("Medium");
      expect(Math.abs(decision.abilityEstimate.theta)).toBeLessThan(0.1);
    });

    it("should handle low confidence with small sample size", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
      ];

      const performance: Module1Performance = {
        totalQuestions: 1,
        correctCount: 1,
        accuracy: 1.0,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      // Small sample should have lower confidence
      expect(decision.confidence).toBeLessThan(1);
      expect(decision.abilityEstimate.standardError).toBeGreaterThan(0);
    });

    it("should handle high confidence with large sample size", () => {
      const responses: QuestionResponse[] = Array(20).fill({
        questionId: "1",
        correct: true,
        parameters: DEFAULT_PARAMETERS.Medium,
      });

      const performance: Module1Performance = {
        totalQuestions: 20,
        correctCount: 20,
        accuracy: 1.0,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "EAP");
      // Large sample should route to Hard with high performance
      expect(decision.module2Difficulty).toBe("Hard");
      expect(decision.abilityEstimate.theta).toBeGreaterThan(0);
    });

    it("should adjust for guessing when detected", () => {
      const responses: QuestionResponse[] = [
        ...Array(3).fill({
          questionId: "1",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
        ...Array(2).fill({
          questionId: "2",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
        ...Array(4).fill({
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Hard,
        }),
        ...Array(1).fill({
          questionId: "4",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        }),
      ];

      const performance: Module1Performance = {
        totalQuestions: 10,
        correctCount: 6,
        accuracy: 0.6,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      // Guessing detection should adjust ability estimate downward
      expect(decision.reasoning).toContain("Guessing detected");
    });

    it("should handle mixed difficulty responses correctly", () => {
      const responses: QuestionResponse[] = [
        { questionId: "1", correct: true, parameters: DEFAULT_PARAMETERS.Easy },
        { questionId: "2", correct: true, parameters: DEFAULT_PARAMETERS.Easy },
        {
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "4",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "5",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      const performance: Module1Performance = {
        totalQuestions: 5,
        correctCount: 3,
        accuracy: 0.6,
        responses,
      };

      const decision = determineModule2Difficulty(performance, "weighted");
      expect(decision.module2Difficulty).toBeDefined();
      expect(["Easy", "Medium", "Hard"]).toContain(decision.module2Difficulty);
    });
  });

  describe("determineModule2DifficultySimple", () => {
    it("should route to Hard for weighted score >= 0.7", () => {
      // Create mix of correct/incorrect with varying difficulty
      const responses: QuestionResponse[] = [
        ...Array(15).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
        ...Array(7).fill({
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
        ...Array(5).fill({
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Hard,
        }),
      ];

      const performance: Module1Performance = {
        totalQuestions: 27,
        correctCount: 20,
        accuracy: 0.74,
        responses,
      };

      const decision = determineModule2DifficultySimple(performance);
      expect(decision.module2Difficulty).toBe("Hard");
      expect(decision.reasoning).toContain("≥ 0.70");
    });

    it("should route to Medium for weighted score in [0.5, 0.7)", () => {
      // Create mix of correct/incorrect with varying difficulty
      const responses: QuestionResponse[] = [
        ...Array(10).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
        ...Array(12).fill({
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
        ...Array(5).fill({
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
      ];

      const performance: Module1Performance = {
        totalQuestions: 27,
        correctCount: 15,
        accuracy: 0.56,
        responses,
      };

      const decision = determineModule2DifficultySimple(performance);
      expect(decision.module2Difficulty).toBe("Medium");
      expect(decision.reasoning).toContain("in [0.50, 0.70)");
    });

    it("should route to Easy for weighted score < 0.5", () => {
      // Create mix of correct/incorrect with varying difficulty
      const responses: QuestionResponse[] = [
        ...Array(5).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
        ...Array(17).fill({
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
        ...Array(5).fill({
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
      ];

      const performance: Module1Performance = {
        totalQuestions: 27,
        correctCount: 10,
        accuracy: 0.37,
        responses,
      };

      const decision = determineModule2DifficultySimple(performance);
      expect(decision.module2Difficulty).toBe("Easy");
      expect(decision.reasoning).toContain("< 0.50");
    });

    it("should handle partial modules with adjusted thresholds", () => {
      const responses: QuestionResponse[] = Array(15).fill({
        questionId: "1",
        correct: true,
        parameters: DEFAULT_PARAMETERS.Medium,
      });

      const performance: Module1Performance = {
        totalQuestions: 15,
        correctCount: 7,
        accuracy: 0.47,
        responses,
      };

      const decision = determineModule2DifficultySimple(performance);
      expect(decision.module2Difficulty).toBeDefined();
      expect(decision.reasoning).toContain("Adjusted score");
    });
  });

  describe("getRecommendedModule1Size", () => {
    it("should return 27 for high confidence (0.9+)", () => {
      expect(getRecommendedModule1Size(0.9)).toBe(27);
      expect(getRecommendedModule1Size(0.95)).toBe(27);
    });

    it("should return 20 for medium-high confidence (0.8+)", () => {
      expect(getRecommendedModule1Size(0.8)).toBe(20);
      expect(getRecommendedModule1Size(0.85)).toBe(20);
    });

    it("should return 15 for medium confidence (0.7+)", () => {
      expect(getRecommendedModule1Size(0.7)).toBe(15);
      expect(getRecommendedModule1Size(0.75)).toBe(15);
    });

    it("should return 10 for low confidence (< 0.7)", () => {
      expect(getRecommendedModule1Size(0.6)).toBe(10);
      expect(getRecommendedModule1Size(0.5)).toBe(10);
    });

    it("should default to 0.8 when no confidence specified", () => {
      expect(getRecommendedModule1Size()).toBe(20);
    });
  });

  describe("validateRoutingDecision", () => {
    it("should return true for confidence >= threshold", () => {
      const decision = {
        module2Difficulty: "Hard" as ModuleDifficulty,
        abilityEstimate: { theta: 1, standardError: 0.2, confidence: 0.95 },
        reasoning: "High performance",
        confidence: 0.95,
      };

      expect(validateRoutingDecision(decision, 0.8)).toBe(true);
      expect(validateRoutingDecision(decision, 0.9)).toBe(true);
    });

    it("should return false for confidence < threshold", () => {
      const decision = {
        module2Difficulty: "Medium" as ModuleDifficulty,
        abilityEstimate: { theta: 0, standardError: 0.8, confidence: 0.4 },
        reasoning: "Borderline",
        confidence: 0.4,
      };

      expect(validateRoutingDecision(decision, 0.6)).toBe(false);
      expect(validateRoutingDecision(decision, 0.5)).toBe(false);
    });

    it("should default to 0.6 threshold", () => {
      const decision = {
        module2Difficulty: "Easy" as ModuleDifficulty,
        abilityEstimate: { theta: -1, standardError: 0.3, confidence: 0.7 },
        reasoning: "Low performance",
        confidence: 0.7,
      };

      expect(validateRoutingDecision(decision)).toBe(true);
    });
  });

  describe("generateRoutingReport", () => {
    it("should generate a detailed routing report", () => {
      const performance: Module1Performance = {
        totalQuestions: 27,
        correctCount: 20,
        accuracy: 0.74,
        responses: [],
      };

      const decision = {
        module2Difficulty: "Hard" as ModuleDifficulty,
        abilityEstimate: { theta: 0.8, standardError: 0.3, confidence: 0.85 },
        reasoning: "High confidence for Hard",
        confidence: 0.85,
      };

      const report = generateRoutingReport(performance, decision);

      expect(report).toContain("Adaptive Routing Report");
      expect(report).toContain("Module 1 Performance");
      expect(report).toContain("Total Questions: 27");
      expect(report).toContain("Correct: 20");
      expect(report).toContain("Accuracy: 74.0%");
      expect(report).toContain("Module 2 Difficulty: Hard");
      expect(report).toContain("Ability Estimate (θ): 0.800");
      expect(report).toContain("Routing Confidence: 85.0%");
    });
  });
});
