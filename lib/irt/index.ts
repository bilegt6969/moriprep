/**
 * IRT-Based Adaptive Routing System
 *
 * Main entry point for the adaptive routing functionality
 *
 * Usage:
 * 1. Track responses during practice session
 * 2. Convert to IRT format
 * 3. Estimate ability
 * 4. Determine Module 2 difficulty
 */

export {
    calculateWeightedScore, detectGuessing, estimateAbilityEAP,
    // Ability Estimation
    estimateAbilityMLE, probabilityCorrect
} from "./ability-estimator";

export type {
    AbilityEstimate,
    DEFAULT_PARAMETERS, IRTParameters,
    QuestionResponse
} from "./ability-estimator";

export {
    // Adaptive Routing
    determineModule2Difficulty,
    determineModule2DifficultySimple,
    generateRoutingReport,
    getParametersForDifficulty,
    getRecommendedModule1Size,
    validateRoutingDecision
} from "./adaptive-routing";

export type {
    Module1Performance, ModuleDifficulty,
    RoutingDecision
} from "./adaptive-routing";

export {
    calculatePerformanceStats,
    detectPerformancePatterns,
    generatePerformanceSummary,
    // Response Tracking
    toIRTResponse,
    toIRTResponses
} from "./response-tracker";

export type {
    PerformancePattern,
    PerformanceStats,
    SessionData,
    TrackedResponse
} from "./response-tracker";

/**
 * Quick-start function for routing
 *
 * Simple API for most common use case:
 * Convert responses → Determine Module 2 difficulty
 */
export function routeToModule2(
  responses: Array<{
    questionId: string;
    isCorrect: boolean;
    difficulty: string;
  }>,
  method: "MLE" | "EAP" | "weighted" = "EAP",
): {
  difficulty: "Easy" | "Medium" | "Hard";
  ability: number;
  confidence: number;
  reasoning: string;
} {
  const {
    toIRTResponses,
    determineModule2Difficulty,
  } = require("./adaptive-routing");
  const { toIRTResponse } = require("./response-tracker");

  const irtResponses = responses.map((r) => ({
    questionId: r.questionId,
    correct: r.isCorrect,
    parameters: require("./ability-estimator").DEFAULT_PARAMETERS[r.difficulty],
  }));

  const performance = {
    totalQuestions: responses.length,
    correctCount: responses.filter((r) => r.isCorrect).length,
    accuracy: responses.filter((r) => r.isCorrect).length / responses.length,
    responses: irtResponses,
  };

  const decision = determineModule2Difficulty(performance, method);

  return {
    difficulty: decision.module2Difficulty,
    ability: decision.abilityEstimate.theta,
    confidence: decision.confidence,
    reasoning: decision.reasoning,
  };
}
