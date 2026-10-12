import { describe, expect, it } from "vitest";
import {
    calculatePerformanceStats,
    detectPerformancePatterns,
    generatePerformanceSummary,
    toIRTResponse,
    toIRTResponses,
    type TrackedResponse,
} from "./response-tracker";

describe("response-tracker - IRT Conversion", () => {
  describe("toIRTResponse", () => {
    it("should convert tracked response to IRT format", () => {
      const tracked: TrackedResponse = {
        questionId: "q1",
        userAnswer: "A",
        correctAnswer: "A",
        isCorrect: true,
        difficulty: "Medium",
        domain: "Algebra",
        skill: "Linear Equations",
        timeSpent: 30,
        timestamp: Date.now(),
      };

      const irtResponse = toIRTResponse(tracked);

      expect(irtResponse.questionId).toBe("q1");
      expect(irtResponse.correct).toBe(true);
      expect(irtResponse.parameters).toBeDefined();
      expect(irtResponse.parameters.a).toBe(1.2);
      expect(irtResponse.parameters.b).toBe(0);
      expect(irtResponse.parameters.c).toBe(0.25);
    });

    it("should use Medium parameters for unknown difficulty", () => {
      const tracked: TrackedResponse = {
        questionId: "q1",
        userAnswer: "A",
        correctAnswer: "A",
        isCorrect: true,
        difficulty: "Unknown",
        domain: "Algebra",
        skill: "Linear Equations",
        timestamp: Date.now(),
      };

      const irtResponse = toIRTResponse(tracked);

      expect(irtResponse.parameters.a).toBe(1.2);
      expect(irtResponse.parameters.b).toBe(0);
    });

    it("should use Easy parameters for Easy difficulty", () => {
      const tracked: TrackedResponse = {
        questionId: "q1",
        userAnswer: "A",
        correctAnswer: "A",
        isCorrect: true,
        difficulty: "Easy",
        domain: "Algebra",
        skill: "Linear Equations",
        timestamp: Date.now(),
      };

      const irtResponse = toIRTResponse(tracked);

      expect(irtResponse.parameters.a).toBe(1.0);
      expect(irtResponse.parameters.b).toBe(-1.0);
    });

    it("should use Hard parameters for Hard difficulty", () => {
      const tracked: TrackedResponse = {
        questionId: "q1",
        userAnswer: "A",
        correctAnswer: "A",
        isCorrect: true,
        difficulty: "Hard",
        domain: "Algebra",
        skill: "Linear Equations",
        timestamp: Date.now(),
      };

      const irtResponse = toIRTResponse(tracked);

      expect(irtResponse.parameters.a).toBe(1.4);
      expect(irtResponse.parameters.b).toBe(1.0);
    });
  });

  describe("toIRTResponses", () => {
    it("should convert array of tracked responses", () => {
      const tracked: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "C",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
      ];

      const irtResponses = toIRTResponses(tracked);

      expect(irtResponses).toHaveLength(2);
      expect(irtResponses[0].questionId).toBe("q1");
      expect(irtResponses[0].correct).toBe(true);
      expect(irtResponses[1].questionId).toBe("q2");
      expect(irtResponses[1].correct).toBe(false);
    });

    it("should handle empty array", () => {
      const irtResponses = toIRTResponses([]);
      expect(irtResponses).toHaveLength(0);
    });
  });
});

describe("response-tracker - Performance Statistics", () => {
  describe("calculatePerformanceStats", () => {
    it("should calculate basic statistics", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "C",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "C",
          correctAnswer: "C",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);

      expect(stats.totalQuestions).toBe(3);
      expect(stats.correctCount).toBe(2);
      expect(stats.accuracy).toBeCloseTo(0.667, 2);
    });

    it("should handle empty responses", () => {
      const stats = calculatePerformanceStats([]);

      expect(stats.totalQuestions).toBe(0);
      expect(stats.correctCount).toBe(0);
      expect(stats.accuracy).toBe(0);
      expect(stats.byDifficulty.Easy.total).toBe(0);
      expect(stats.byDifficulty.Medium.total).toBe(0);
      expect(stats.byDifficulty.Hard.total).toBe(0);
      expect(stats.averageTime).toBe(0);
    });

    it("should calculate statistics by difficulty", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "C",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "C",
          correctAnswer: "C",
          isCorrect: true,
          difficulty: "Medium",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);

      expect(stats.byDifficulty.Easy.total).toBe(2);
      expect(stats.byDifficulty.Easy.correct).toBe(1);
      expect(stats.byDifficulty.Easy.accuracy).toBe(0.5);
      expect(stats.byDifficulty.Medium.total).toBe(1);
      expect(stats.byDifficulty.Medium.correct).toBe(1);
      expect(stats.byDifficulty.Medium.accuracy).toBe(1);
    });

    it("should calculate statistics by domain", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "C",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "C",
          correctAnswer: "C",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);

      expect(stats.byDomain["Algebra"]).toBeDefined();
      expect(stats.byDomain["Algebra"].total).toBe(2);
      expect(stats.byDomain["Algebra"].correct).toBe(1);
      expect(stats.byDomain["Algebra"].accuracy).toBe(0.5);
      expect(stats.byDomain["Geometry"]).toBeDefined();
      expect(stats.byDomain["Geometry"].total).toBe(1);
      expect(stats.byDomain["Geometry"].correct).toBe(1);
    });

    it("should calculate average time", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: 30,
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "C",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timeSpent: 60,
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "C",
          correctAnswer: "C",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timeSpent: 90,
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);

      expect(stats.averageTime).toBe(60);
    });

    it("should handle missing time data", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "C",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);

      expect(stats.averageTime).toBe(0);
    });

    it("should ignore negative time values", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: -10, // Invalid negative time
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);
      // Negative times should be ignored, resulting in 0 average
      expect(stats.averageTime).toBe(0);
    });

    it("should handle very large time values", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: 999999, // Very large time
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);
      expect(stats.averageTime).toBe(999999);
    });
  });

  describe("generatePerformanceSummary", () => {
    it("should generate a readable summary", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: 30,
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "C",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timeSpent: 60,
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);
      const summary = generatePerformanceSummary(stats);

      expect(summary).toContain("Total Questions: 2");
      expect(summary).toContain("Correct: 1");
      expect(summary).toContain("Accuracy: 50.0%");
      expect(summary).toContain("By Difficulty:");
      expect(summary).toContain("Average Time: 45.0s per question");
    });
  });
});

describe("response-tracker - Performance Patterns", () => {
  describe("detectPerformancePatterns", () => {
    it("should detect strong domains", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "B",
          correctAnswer: "B",
          isCorrect: true,
          difficulty: "Medium",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "C",
          correctAnswer: "C",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Polynomials",
          timestamp: Date.now(),
        },
        {
          questionId: "q4",
          userAnswer: "D",
          correctAnswer: "E",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);

      expect(patterns.strongDomains).toContain("Algebra");
    });

    it("should detect weak domains", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "B",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "C",
          correctAnswer: "D",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Triangles",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "E",
          correctAnswer: "F",
          isCorrect: false,
          difficulty: "Hard",
          domain: "Geometry",
          skill: "Circles",
          timestamp: Date.now(),
        },
        {
          questionId: "q4",
          userAnswer: "G",
          correctAnswer: "G",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);

      expect(patterns.weakDomains).toContain("Geometry");
    });

    it("should detect guessing pattern", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "B",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "C",
          correctAnswer: "D",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "E",
          correctAnswer: "F",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q4",
          userAnswer: "G",
          correctAnswer: "G",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q5",
          userAnswer: "H",
          correctAnswer: "H",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Polynomials",
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);

      expect(patterns.guessingDetected).toBe(true);
    });

    it("should detect time pressure", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "B",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: 5,
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "C",
          correctAnswer: "D",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timeSpent: 8,
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "E",
          correctAnswer: "F",
          isCorrect: false,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timeSpent: 6,
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);

      expect(patterns.timePressure).toBe(true);
    });

    it("should detect improving trend", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "B",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "C",
          correctAnswer: "D",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "E",
          correctAnswer: "E",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q4",
          userAnswer: "G",
          correctAnswer: "G",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Geometry",
          skill: "Triangles",
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);

      expect(patterns.overallTrend).toBe("improving");
    });

    it("should detect declining trend", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "C",
          correctAnswer: "C",
          isCorrect: true,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "E",
          correctAnswer: "F",
          isCorrect: false,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q4",
          userAnswer: "G",
          correctAnswer: "H",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Geometry",
          skill: "Triangles",
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);

      expect(patterns.overallTrend).toBe("declining");
    });

    it("should detect stable trend", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "C",
          correctAnswer: "D",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timestamp: Date.now(),
        },
        {
          questionId: "q3",
          userAnswer: "E",
          correctAnswer: "E",
          isCorrect: true,
          difficulty: "Hard",
          domain: "Algebra",
          skill: "Quadratic Equations",
          timestamp: Date.now(),
        },
        {
          questionId: "q4",
          userAnswer: "G",
          correctAnswer: "H",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Geometry",
          skill: "Triangles",
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);

      expect(patterns.overallTrend).toBe("stable");
    });

    it("should handle empty response array for pattern detection", () => {
      const patterns = detectPerformancePatterns([]);

      expect(patterns.strongDomains).toEqual([]);
      expect(patterns.weakDomains).toEqual([]);
      expect(patterns.guessingDetected).toBe(false);
      expect(patterns.timePressure).toBe(false);
      expect(patterns.overallTrend).toBe("stable");
    });

    it("should handle responses with missing domain", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "", // Missing domain
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);
      // Should handle missing domain gracefully
      expect(stats.totalQuestions).toBe(1);
      expect(stats.correctCount).toBe(1);
    });

    it("should handle responses with zero time values", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: 0, // Zero time
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);
      // Zero time should be ignored
      expect(stats.averageTime).toBe(0);
    });

    it("should handle responses with invalid difficulty", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "InvalidDifficulty", // Not Easy/Medium/Hard
          domain: "Algebra",
          skill: "Linear Equations",
          timestamp: Date.now(),
        },
      ];

      const stats = calculatePerformanceStats(responses);
      // Should handle invalid difficulty without crashing
      expect(stats.totalQuestions).toBe(1);
      expect(stats.correctCount).toBe(1);
    });

    it("should detect time pressure correctly", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "B",
          isCorrect: false,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: 3, // Very fast
          timestamp: Date.now(),
        },
        {
          questionId: "q2",
          userAnswer: "C",
          correctAnswer: "D",
          isCorrect: false,
          difficulty: "Medium",
          domain: "Geometry",
          skill: "Angles",
          timeSpent: 4, // Very fast
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);
      expect(patterns.timePressure).toBe(true);
    });

    it("should not detect time pressure with reasonable times", () => {
      const responses: TrackedResponse[] = [
        {
          questionId: "q1",
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          difficulty: "Easy",
          domain: "Algebra",
          skill: "Linear Equations",
          timeSpent: 30, // Reasonable time
          timestamp: Date.now(),
        },
      ];

      const patterns = detectPerformancePatterns(responses);
      expect(patterns.timePressure).toBe(false);
    });
  });
});
