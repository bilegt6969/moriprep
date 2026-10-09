import { NextRequest, NextResponse } from "next/server";
import {
  determineModule2Difficulty,
  Module1Performance,
  QuestionResponse,
  generateRoutingReport,
  toIRTResponses,
  calculatePerformanceStats,
  detectPerformancePatterns,
} from "@/lib/irt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      responses,
      method = "EAP",
      testType = "Reading and Writing",
    } = body as {
      responses: Array<{
        questionId: string;
        isCorrect: boolean;
        difficulty: string;
        domain?: string;
        skill?: string;
        timeSpent?: number;
      }>;
      method?: "MLE" | "EAP" | "weighted";
      testType?: "Reading and Writing" | "Math";
    };

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Invalid responses data" },
        { status: 400 }
      );
    }

    // Convert to IRT format
    const irtResponses: QuestionResponse[] = responses.map((r) => ({
      questionId: r.questionId,
      correct: r.isCorrect,
      parameters: {
        a: r.difficulty === "Easy" ? 1.0 : r.difficulty === "Medium" ? 1.2 : 1.4,
        b: r.difficulty === "Easy" ? -1.0 : r.difficulty === "Medium" ? 0.0 : 1.0,
        c: 0.25,
      },
    }));

    // Create performance object
    const performance: Module1Performance = {
      totalQuestions: responses.length,
      correctCount: responses.filter((r) => r.isCorrect).length,
      accuracy: responses.filter((r) => r.isCorrect).length / responses.length,
      responses: irtResponses,
    };

    // Determine Module 2 difficulty
    const routingDecision = determineModule2Difficulty(performance, method);

    // Calculate additional stats
    const trackedResponses = responses.map((r) => ({
      questionId: r.questionId,
      userAnswer: "", // Not provided in this API
      correctAnswer: "",
      isCorrect: r.isCorrect,
      difficulty: r.difficulty,
      domain: r.domain || "Unknown",
      skill: r.skill || "Unknown",
      timeSpent: r.timeSpent,
      timestamp: Date.now(),
    }));

    const performanceStats = calculatePerformanceStats(trackedResponses);
    const patterns = detectPerformancePatterns(trackedResponses);

    // Generate routing report
    const report = generateRoutingReport(performance, routingDecision);

    return NextResponse.json({
      routing: {
        module2Difficulty: routingDecision.module2Difficulty,
        abilityEstimate: routingDecision.abilityEstimate,
        confidence: routingDecision.confidence,
        reasoning: routingDecision.reasoning,
      },
      performance: {
        totalQuestions: performanceStats.totalQuestions,
        correctCount: performanceStats.correctCount,
        accuracy: performanceStats.accuracy,
        byDifficulty: performanceStats.byDifficulty,
        byDomain: performanceStats.byDomain,
        averageTime: performanceStats.averageTime,
      },
      patterns,
      report,
    });
  } catch (error) {
    console.error("Error in adaptive routing:", error);
    return NextResponse.json(
      { error: "Failed to determine routing" },
      { status: 500 }
    );
  }
}
