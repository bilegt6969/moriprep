/**
 * Response Tracker
 * 
 * Converts question responses into IRT-compatible format
 * and tracks performance during a practice session
 */

import { QuestionResponse, IRTParameters, DEFAULT_PARAMETERS } from "./ability-estimator";

export interface TrackedResponse {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  difficulty: string;
  domain: string;
  skill: string;
  timeSpent?: number; // seconds
  timestamp: number;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  testType: "Reading and Writing" | "Math";
  module: 1 | 2;
  responses: TrackedResponse[];
  startTime: number;
  endTime?: number;
}

/**
 * Convert tracked response to IRT QuestionResponse
 */
export function toIRTResponse(
  tracked: TrackedResponse
): QuestionResponse {
  const parameters = DEFAULT_PARAMETERS[tracked.difficulty] || DEFAULT_PARAMETERS.Medium;

  return {
    questionId: tracked.questionId,
    correct: tracked.isCorrect,
    parameters,
  };
}

/**
 * Convert array of tracked responses to IRT format
 */
export function toIRTResponses(
  trackedResponses: TrackedResponse[]
): QuestionResponse[] {
  return trackedResponses.map(toIRTResponse);
}

/**
 * Calculate performance statistics from tracked responses
 */
export interface PerformanceStats {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  byDifficulty: {
    Easy: { total: number; correct: number; accuracy: number };
    Medium: { total: number; correct: number; accuracy: number };
    Hard: { total: number; correct: number; accuracy: number };
  };
  byDomain: Record<string, { total: number; correct: number; accuracy: number }>;
  averageTime: number; // seconds per question
}

export function calculatePerformanceStats(
  responses: TrackedResponse[]
): PerformanceStats {
  const totalQuestions = responses.length;
  const correctCount = responses.filter((r) => r.isCorrect).length;
  const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  // By difficulty
  const byDifficulty = {
    Easy: { total: 0, correct: 0, accuracy: 0 },
    Medium: { total: 0, correct: 0, accuracy: 0 },
    Hard: { total: 0, correct: 0, accuracy: 0 },
  };

  // By domain
  const byDomain: Record<string, { total: number; correct: number; accuracy: number }> = {};

  // Average time
  let totalTime = 0;
  let timedQuestions = 0;

  for (const response of responses) {
    // By difficulty
    const diff = response.difficulty as keyof typeof byDifficulty;
    if (byDifficulty[diff]) {
      byDifficulty[diff].total++;
      if (response.isCorrect) byDifficulty[diff].correct++;
    }

    // By domain
    if (!byDomain[response.domain]) {
      byDomain[response.domain] = { total: 0, correct: 0, accuracy: 0 };
    }
    byDomain[response.domain].total++;
    if (response.isCorrect) byDomain[response.domain].correct++;

    // Time
    if (response.timeSpent) {
      totalTime += response.timeSpent;
      timedQuestions++;
    }
  }

  // Calculate accuracies
  for (const diff of ["Easy", "Medium", "Hard"] as const) {
    byDifficulty[diff].accuracy =
      byDifficulty[diff].total > 0
        ? byDifficulty[diff].correct / byDifficulty[diff].total
        : 0;
  }

  for (const domain in byDomain) {
    byDomain[domain].accuracy =
      byDomain[domain].total > 0
        ? byDomain[domain].correct / byDomain[domain].total
        : 0;
  }

  const averageTime = timedQuestions > 0 ? totalTime / timedQuestions : 0;

  return {
    totalQuestions,
    correctCount,
    accuracy,
    byDifficulty,
    byDomain,
    averageTime,
  };
}

/**
 * Generate a summary of performance for display
 */
export function generatePerformanceSummary(
  stats: PerformanceStats
): string {
  const lines = [
    `Total Questions: ${stats.totalQuestions}`,
    `Correct: ${stats.correctCount}`,
    `Accuracy: ${(stats.accuracy * 100).toFixed(1)}%`,
    "",
    "By Difficulty:",
    `  Easy: ${stats.byDifficulty.Easy.correct}/${stats.byDifficulty.Easy.total} (${(stats.byDifficulty.Easy.accuracy * 100).toFixed(1)}%)`,
    `  Medium: ${stats.byDifficulty.Medium.correct}/${stats.byDifficulty.Medium.total} (${(stats.byDifficulty.Medium.accuracy * 100).toFixed(1)}%)`,
    `  Hard: ${stats.byDifficulty.Hard.correct}/${stats.byDifficulty.Hard.total} (${(stats.byDifficulty.Hard.accuracy * 100).toFixed(1)}%)`,
    "",
    "By Domain:",
  ];

  for (const [domain, data] of Object.entries(stats.byDomain)) {
    lines.push(`  ${domain}: ${data.correct}/${data.total} (${(data.accuracy * 100).toFixed(1)}%)`);
  }

  if (stats.averageTime > 0) {
    lines.push("");
    lines.push(`Average Time: ${stats.averageTime.toFixed(1)}s per question`);
  }

  return lines.join("\n");
}

/**
 * Detect performance patterns
 */
export interface PerformancePattern {
  strongDomains: string[];
  weakDomains: string[];
  guessingDetected: boolean;
  timePressure: boolean;
  overallTrend: "improving" | "declining" | "stable";
}

export function detectPerformancePatterns(
  responses: TrackedResponse[]
): PerformancePattern {
  const stats = calculatePerformanceStats(responses);

  // Strong domains (accuracy > 0.7)
  const strongDomains = Object.entries(stats.byDomain)
    .filter(([_, data]) => data.accuracy > 0.7 && data.total >= 3)
    .map(([domain]) => domain);

  // Weak domains (accuracy < 0.5)
  const weakDomains = Object.entries(stats.byDomain)
    .filter(([_, data]) => data.accuracy < 0.5 && data.total >= 3)
    .map(([domain]) => domain);

  // Guessing detection (high accuracy on hard questions, low on easy)
  const guessingDetected =
    stats.byDifficulty.Hard.accuracy > 0.6 &&
    stats.byDifficulty.Easy.accuracy < 0.5 &&
    stats.byDifficulty.Easy.total >= 3;

  // Time pressure (very fast responses with low accuracy)
  const timePressure =
    stats.averageTime > 0 &&
    stats.averageTime < 10 &&
    stats.accuracy < 0.5;

  // Trend analysis (first half vs second half)
  const midPoint = Math.floor(responses.length / 2);
  const firstHalf = responses.slice(0, midPoint);
  const secondHalf = responses.slice(midPoint);

  const firstHalfAccuracy =
    firstHalf.length > 0
      ? firstHalf.filter((r) => r.isCorrect).length / firstHalf.length
      : 0;
  const secondHalfAccuracy =
    secondHalf.length > 0
      ? secondHalf.filter((r) => r.isCorrect).length / secondHalf.length
      : 0;

  let overallTrend: "improving" | "declining" | "stable" = "stable";
  if (secondHalfAccuracy - firstHalfAccuracy > 0.15) {
    overallTrend = "improving";
  } else if (firstHalfAccuracy - secondHalfAccuracy > 0.15) {
    overallTrend = "declining";
  }

  return {
    strongDomains,
    weakDomains,
    guessingDetected,
    timePressure,
    overallTrend,
  };
}
