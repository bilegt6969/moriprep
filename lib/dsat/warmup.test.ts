import { describe, expect, it } from "vitest";
import {
  getWarmupPlan,
  READING_WRITING_DOMAINS,
  WARMUP_DURATION_SECONDS,
} from "./warmup";

describe("five-minute warmup planning", () => {
  it("prioritizes missed skills and excludes answers taking six minutes or longer", () => {
    const plan = getWarmupPlan([
      {
        questionId: "weak-1",
        domain: READING_WRITING_DOMAINS[0],
        skill: "Inference",
        attempts: [
          { isCorrect: false, timeSpent: 60_000 },
          { isCorrect: false, timeSpent: 360_000 },
        ],
      },
      {
        questionId: "strong-1",
        domain: READING_WRITING_DOMAINS[1],
        skill: "Central Ideas",
        attempts: [{ isCorrect: true, timeSpent: 120_000 }],
      },
    ]);

    expect(plan.skills).toEqual(["Inference"]);
    expect(plan.priorityQuestionIds).toEqual(["weak-1"]);
    expect(plan.averageTimeMs).toBe(90_000);
    expect(plan.questionCount).toBe(
      Math.floor((WARMUP_DURATION_SECONDS * 1000 * 0.82) / 90_000),
    );
  });

  it("uses a balanced RW fallback when no performance history exists", () => {
    const plan = getWarmupPlan([]);

    expect(plan.skills).toEqual([]);
    expect(plan.domains).toEqual([...READING_WRITING_DOMAINS]);
    expect(plan.questionCount).toBe(3);
  });

  it("does not treat abandoned attempts as weak-skill evidence", () => {
    const plan = getWarmupPlan([
      {
        questionId: "abandoned",
        domain: READING_WRITING_DOMAINS[0],
        skill: "Abandoned skill",
        attempts: [{ isCorrect: false, timeSpent: 360_000 }],
      },
      {
        questionId: "valid",
        domain: READING_WRITING_DOMAINS[1],
        skill: "Practiced skill",
        attempts: [{ isCorrect: true, timeSpent: 60_000 }],
      },
    ]);

    expect(plan.skills).toEqual(["Practiced skill"]);
    expect(plan.priorityQuestionIds).toEqual([]);
    expect(plan.averageTimeMs).toBe(60_000);
  });

  it("does not restore abandoned attempts from legacy answer history", () => {
    const plan = getWarmupPlan(
      [
        {
          questionId: "abandoned",
          domain: READING_WRITING_DOMAINS[0],
          skill: "Abandoned skill",
          attempts: [{ isCorrect: false, timeSpent: 360_000 }],
        },
      ],
      [{ domain: READING_WRITING_DOMAINS[0], isCorrect: false }],
    );

    expect(plan.skills).toEqual([]);
    expect(plan.domains).toEqual([...READING_WRITING_DOMAINS]);
  });
});
