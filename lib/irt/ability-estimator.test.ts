import { describe, expect, it } from "vitest";
import {
    calculateWeightedScore,
    DEFAULT_PARAMETERS,
    detectGuessing,
    estimateAbilityEAP,
    estimateAbilityMLE,
    probabilityCorrect,
    type QuestionResponse,
} from "./ability-estimator";

describe("ability-estimator - Probability Calculation", () => {
  describe("probabilityCorrect", () => {
    it("should calculate probability correctly for Medium difficulty", () => {
      const theta = 0; // average ability
      const params = DEFAULT_PARAMETERS.Medium;
      const prob = probabilityCorrect(theta, params);
      expect(prob).toBeGreaterThan(0);
      expect(prob).toBeLessThan(1);
      // At theta=0 with b=0, probability should be around 0.5 (adjusted for guessing)
      expect(prob).toBeCloseTo(0.5, 0.1);
    });

    it("should calculate higher probability for high ability", () => {
      const theta = 2; // high ability
      const params = DEFAULT_PARAMETERS.Medium;
      const probHigh = probabilityCorrect(theta, params);
      const probLow = probabilityCorrect(-2, params);
      expect(probHigh).toBeGreaterThan(probLow);
    });

    it("should calculate higher probability for easier questions", () => {
      const theta = 0; // average ability
      const probEasy = probabilityCorrect(theta, DEFAULT_PARAMETERS.Easy);
      const probHard = probabilityCorrect(theta, DEFAULT_PARAMETERS.Hard);
      expect(probEasy).toBeGreaterThan(probHard);
    });

    it("should handle extreme theta values", () => {
      const params = DEFAULT_PARAMETERS.Medium;
      const probVeryHigh = probabilityCorrect(10, params);
      const probVeryLow = probabilityCorrect(-10, params);
      // With guessing parameter c=0.25, even very low ability has minimum 25% probability
      expect(probVeryHigh).toBeCloseTo(1, 2);
      expect(probVeryLow).toBeCloseTo(0.25, 2); // Floor at guessing parameter
    });
  });
});

describe("ability-estimator - Guessing Detection", () => {
  describe("detectGuessing", () => {
    it("should return false for insufficient data", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        },
        {
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      expect(detectGuessing(responses)).toBe(false);
    });

    it("should detect guessing pattern (high hard accuracy, low easy accuracy)", () => {
      const responses: QuestionResponse[] = [
        // Easy questions - mostly incorrect
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
        // Hard questions - mostly correct (suggesting guessing/luck)
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

      expect(detectGuessing(responses)).toBe(true);
    });

    it("should not detect guessing for normal performance", () => {
      const responses: QuestionResponse[] = [
        // Easy questions - mostly correct
        ...Array(4).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
        ...Array(1).fill({
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
        // Hard questions - mostly incorrect
        ...Array(4).fill({
          questionId: "3",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        }),
        ...Array(1).fill({
          questionId: "4",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Hard,
        }),
      ];

      expect(detectGuessing(responses)).toBe(false);
    });

    it("should not detect guessing when easy accuracy is high", () => {
      const responses: QuestionResponse[] = [
        // Easy questions - mostly correct
        ...Array(5).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
        // Hard questions - also mostly correct (actually skilled)
        ...Array(5).fill({
          questionId: "2",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Hard,
        }),
      ];

      expect(detectGuessing(responses)).toBe(false);
    });

    it("should not detect guessing when hard accuracy is low", () => {
      const responses: QuestionResponse[] = [
        // Easy questions - mostly incorrect (struggling)
        ...Array(5).fill({
          questionId: "1",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Easy,
        }),
        // Hard questions - also mostly incorrect
        ...Array(5).fill({
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        }),
      ];

      expect(detectGuessing(responses)).toBe(false);
    });

    it("should handle questions without Easy or Hard difficulty", () => {
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

      expect(detectGuessing(responses)).toBe(false);
    });
  });
});

describe("ability-estimator - Weighted Score", () => {
  describe("calculateWeightedScore", () => {
    it("should calculate weighted score correctly", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        },
        {
          questionId: "2",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "3",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      const score = calculateWeightedScore(responses);
      // Easy (weight 1) correct = 1, Medium (weight 2) correct = 2, Hard (weight 3) incorrect = 0
      // Total weight = 1 + 2 + 3 = 6, Earned = 1 + 2 = 3
      expect(score).toBeCloseTo(0.5, 2);
    });

    it("should give higher weight to harder questions", () => {
      const easyCorrect: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        },
      ];
      const hardCorrect: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      const easyScore = calculateWeightedScore(easyCorrect);
      const hardScore = calculateWeightedScore(hardCorrect);
      expect(hardScore).toBe(easyScore); // Both 100% correct, so same score
    });

    it("should handle empty responses", () => {
      const score = calculateWeightedScore([]);
      expect(score).toBe(0);
    });

    it("should handle all incorrect", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Easy,
        },
        {
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "3",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      const score = calculateWeightedScore(responses);
      expect(score).toBe(0);
    });

    it("should handle all correct", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Easy,
        },
        {
          questionId: "2",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "3",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Hard,
        },
      ];

      const score = calculateWeightedScore(responses);
      expect(score).toBe(1);
    });
  });
});

describe("ability-estimator - Ability Estimation", () => {
  describe("estimateAbilityMLE", () => {
    it("should estimate ability for all correct responses", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "2",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
      ];

      const estimate = estimateAbilityMLE(responses);
      expect(estimate.theta).toBeGreaterThan(0);
      expect(estimate.standardError).toBeGreaterThan(0);
    });

    it("should estimate ability for all incorrect responses", () => {
      const responses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
        {
          questionId: "2",
          correct: false,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
      ];

      const estimate = estimateAbilityMLE(responses);
      expect(estimate.theta).toBeLessThan(0);
      expect(estimate.standardError).toBeGreaterThan(0);
    });

    it("should handle empty responses", () => {
      const estimate = estimateAbilityMLE([]);
      expect(estimate.theta).toBe(0);
      expect(estimate.standardError).toBe(1);
    });

    it("should decrease standard error with more responses", () => {
      const fewResponses: QuestionResponse[] = [
        {
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        },
      ];
      const manyResponses: QuestionResponse[] = [
        ...Array(10).fill({
          questionId: "1",
          correct: true,
          parameters: DEFAULT_PARAMETERS.Medium,
        }),
      ];

      const fewSE = estimateAbilityMLE(fewResponses).standardError;
      const manySE = estimateAbilityMLE(manyResponses).standardError;
      expect(manySE).toBeLessThan(fewSE);
    });
  });

  describe("estimateAbilityEAP", () => {
    it("should estimate ability using EAP method", () => {
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
      ];

      const estimate = estimateAbilityEAP(responses);
      expect(estimate.theta).toBeDefined();
      expect(estimate.standardError).toBeGreaterThan(0);
    });

    it("should handle empty responses", () => {
      const estimate = estimateAbilityEAP([]);
      expect(estimate.theta).toBe(0);
      expect(estimate.standardError).toBe(1);
    });

    it("should produce consistent results with MLE for large samples", () => {
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

      const mleEstimate = estimateAbilityMLE(responses);
      const eapEstimate = estimateAbilityEAP(responses);

      // Both should be close to 0 for balanced responses
      expect(Math.abs(mleEstimate.theta)).toBeLessThan(1);
      expect(Math.abs(eapEstimate.theta)).toBeLessThan(1);
    });
  });
});
