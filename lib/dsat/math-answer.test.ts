import { describe, expect, it } from "vitest";
import { isMathAnswerCorrect } from "./math-answer";

describe("isMathAnswerCorrect", () => {
  it("accepts any trimmed correct response", () => {
    expect(isMathAnswerCorrect("  25/4 ", "25/4", ["25/4", "6.25"])).toBe(true);
    expect(isMathAnswerCorrect(" 6.25 ", "25/4", ["25/4", "6.25"])).toBe(true);
  });

  it("compares fractional and decimal numeric values", () => {
    expect(isMathAnswerCorrect("1/4", "0.25", ["0.25"])).toBe(true);
    expect(isMathAnswerCorrect(" 0.25 ", "1/4", ["1/4"])).toBe(true);
    expect(isMathAnswerCorrect("2/4", "1/2", ["0.5"])).toBe(true);
  });

  it("does not accept unrelated values or divide-by-zero fractions", () => {
    expect(isMathAnswerCorrect("0.3", "1/4", ["0.25"])).toBe(false);
    expect(isMathAnswerCorrect("1/0", "0", ["0"])).toBe(false);
  });
});
