/**
 * Adaptive Routing Module
 * 
 * Determines Module 2 difficulty based on Module 1 performance
 * using Item Response Theory (IRT) ability estimation
 */

import {
  QuestionResponse,
  AbilityEstimate,
  estimateAbilityMLE,
  estimateAbilityEAP,
  detectGuessing,
  calculateWeightedScore,
  DEFAULT_PARAMETERS,
} from "./ability-estimator";

export type ModuleDifficulty = "Easy" | "Medium" | "Hard";

export interface RoutingDecision {
  module2Difficulty: ModuleDifficulty;
  abilityEstimate: AbilityEstimate;
  reasoning: string;
  confidence: number;
}

export interface Module1Performance {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  responses: QuestionResponse[];
  timeSpent?: number; // optional time data
}

/**
 * Convert difficulty string to IRT parameters
 */
export function getParametersForDifficulty(
  difficulty: string
): typeof DEFAULT_PARAMETERS[keyof typeof DEFAULT_PARAMETERS] {
  return DEFAULT_PARAMETERS[difficulty] || DEFAULT_PARAMETERS.Medium;
}

/**
 * Determine Module 2 difficulty based on Module 1 performance
 * 
 * Routing Logic:
 * - Uses IRT ability estimation for accurate routing
 * - Considers question difficulty, not just raw score
 * - Detects and adjusts for guessing patterns
 * - Provides confidence in routing decision
 */
export function determineModule2Difficulty(
  performance: Module1Performance,
  method: "MLE" | "EAP" | "weighted" = "EAP"
): RoutingDecision {
  const { totalQuestions, correctCount, responses } = performance;

  // Fallback to simple routing if no responses
  if (responses.length === 0) {
    return {
      module2Difficulty: "Medium",
      abilityEstimate: { theta: 0, standardError: 1, confidence: 1.96 },
      reasoning: "No performance data available, defaulting to Medium",
      confidence: 0,
    };
  }

  // Estimate ability using specified method
  let abilityEstimate: AbilityEstimate;
  let reasoning: string;

  if (method === "weighted") {
    // Simpler weighted score approach
    const weightedScore = calculateWeightedScore(responses);
    abilityEstimate = {
      theta: (weightedScore - 0.5) * 2, // Convert to roughly standard normal
      standardError: 0.5,
      confidence: 0.98,
    };
    reasoning = `Weighted score: ${(weightedScore * 100).toFixed(1)}%`;
  } else {
    // Full IRT estimation
    abilityEstimate =
      method === "MLE"
        ? estimateAbilityMLE(responses)
        : estimateAbilityEAP(responses);
    reasoning = `IRT ability estimate: ${abilityEstimate.theta.toFixed(2)} (SE: ${abilityEstimate.standardError.toFixed(2)})`;
  }

  // Detect guessing and adjust
  const isGuessing = detectGuessing(responses);
  if (isGuessing) {
    abilityEstimate.theta -= 0.5; // Penalize ability estimate
    reasoning += " | Guessing detected, adjusted estimate downward";
  }

  // Route based on ability estimate
  // Thresholds calibrated for SAT-style adaptive testing
  const theta = abilityEstimate.theta;
  const se = abilityEstimate.standardError;

  let module2Difficulty: ModuleDifficulty;
  let routingReasoning = reasoning;

  // Consider confidence intervals for more nuanced routing
  const lowerBound = theta - se;
  const upperBound = theta + se;

  if (upperBound < -0.5) {
    // High confidence for lower ability
    module2Difficulty = "Easy";
    routingReasoning += " | High confidence for Easy (θ < -0.5)";
  } else if (lowerBound > 0.5) {
    // High confidence for higher ability
    module2Difficulty = "Hard";
    routingReasoning += " | High confidence for Hard (θ > 0.5)";
  } else if (theta < 0) {
    // Moderate confidence for lower ability
    module2Difficulty = "Easy";
    routingReasoning += " | Moderate confidence for Easy (θ < 0)";
  } else if (theta > 0) {
    // Moderate confidence for higher ability
    module2Difficulty = "Hard";
    routingReasoning += " | Moderate confidence for Hard (θ > 0)";
  } else {
    // Borderline case
    module2Difficulty = "Medium";
    routingReasoning += " | Borderline, defaulting to Medium";
  }

  // Calculate routing confidence based on standard error
  const routingConfidence = Math.max(0, 1 - se);

  return {
    module2Difficulty,
    abilityEstimate,
    reasoning: routingReasoning,
    confidence: routingConfidence,
  };
}

/**
 * Alternative routing based on weighted score thresholds
 * Simpler but less accurate than IRT
 */
export function determineModule2DifficultySimple(
  performance: Module1Performance
): RoutingDecision {
  const { totalQuestions, correctCount, responses } = performance;

  const accuracy = correctCount / totalQuestions;
  const weightedScore = calculateWeightedScore(responses);

  let module2Difficulty: ModuleDifficulty;
  let reasoning: string;

  // Thresholds for RW (27 questions)
  if (totalQuestions >= 25) {
    // Full module
    if (weightedScore >= 0.7) {
      module2Difficulty = "Hard";
      reasoning = `Weighted score ${weightedScore.toFixed(2)} ≥ 0.70 → Hard`;
    } else if (weightedScore >= 0.5) {
      module2Difficulty = "Medium";
      reasoning = `Weighted score ${weightedScore.toFixed(2)} in [0.50, 0.70) → Medium`;
    } else {
      module2Difficulty = "Easy";
      reasoning = `Weighted score ${weightedScore.toFixed(2)} < 0.50 → Easy`;
    }
  } else {
    // Partial module (adaptive based on proportion)
    const adjustedThreshold = weightedScore;
    if (adjustedThreshold >= 0.65) {
      module2Difficulty = "Hard";
      reasoning = `Adjusted score ${adjustedThreshold.toFixed(2)} ≥ 0.65 → Hard`;
    } else if (adjustedThreshold >= 0.45) {
      module2Difficulty = "Medium";
      reasoning = `Adjusted score ${adjustedThreshold.toFixed(2)} in [0.45, 0.65) → Medium`;
    } else {
      module2Difficulty = "Easy";
      reasoning = `Adjusted score ${adjustedThreshold.toFixed(2)} < 0.45 → Easy`;
    }
  }

  return {
    module2Difficulty,
    abilityEstimate: {
      theta: (weightedScore - 0.5) * 2,
      standardError: 0.5,
      confidence: 0.5,
    },
    reasoning,
    confidence: 0.5,
  };
}

/**
 * Get recommended number of questions for Module 1
 * based on desired confidence in routing
 */
export function getRecommendedModule1Size(
  desiredConfidence: number = 0.8
): number {
  // More questions = higher confidence
  // SAT uses 27 for RW, 22 for Math
  if (desiredConfidence >= 0.9) return 27;
  if (desiredConfidence >= 0.8) return 20;
  if (desiredConfidence >= 0.7) return 15;
  return 10;
}

/**
 * Validate routing decision
 * Returns true if routing decision is statistically sound
 */
export function validateRoutingDecision(
  decision: RoutingDecision,
  minConfidence: number = 0.6
): boolean {
  return decision.confidence >= minConfidence;
}

/**
 * Generate routing report for analytics/debugging
 */
export function generateRoutingReport(
  performance: Module1Performance,
  decision: RoutingDecision
): string {
  const { totalQuestions, correctCount, accuracy } = performance;

  return `
=== Adaptive Routing Report ===
Module 1 Performance:
- Total Questions: ${totalQuestions}
- Correct: ${correctCount}
- Accuracy: ${(accuracy * 100).toFixed(1)}%

Routing Decision:
- Module 2 Difficulty: ${decision.module2Difficulty}
- Ability Estimate (θ): ${decision.abilityEstimate.theta.toFixed(3)}
- Standard Error: ${decision.abilityEstimate.standardError.toFixed(3)}
- Routing Confidence: ${(decision.confidence * 100).toFixed(1)}%
- Reasoning: ${decision.reasoning}

=== End Report ===
`;
}
